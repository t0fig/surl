package main

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"
)

var dbService = os.Getenv("db_service")
var dbUser = os.Getenv("db_user")
var dbPassword = os.Getenv("db_password")
var dbUri = "mongodb://" + dbUser + ":" + dbPassword + "@" + dbService + ":27017"

var col *mongo.Collection

type UrlMapping struct {
	ShortURL string `bson:"short_url"`
	LongURL  string `bson:"long_url"`
}
type LinkAddRequest struct {
	URL string `json:"url"`
}

func shortenUrl(url string) string {
	hash := sha256.Sum256([]byte(url))
	shortURL := base64.RawURLEncoding.EncodeToString(hash[:5])
	return shortURL
}

func setupDB() (context.Context, context.CancelFunc) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(dbUri))
	if err != nil {
		log.Fatal(err)
	}
	db := client.Database("shortener")
	col = db.Collection("Mappings")
	log.Print("Successfully set up db!")
	return ctx, cancel
}

func getLinkMapping(w http.ResponseWriter, r *http.Request) {
	log.Print("Request with URI " + r.RequestURI + " received!")
	if r.RequestURI == "/api/add" {
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "Get method should be used to get long url from short one",
			http.StatusBadRequest)
	}
	ctx, cancel := setupDB()
	defer cancel()
	path := r.RequestURI[5:]
	log.Print("Short URL sent to get corresponding long URL of: " + path)
	var urlMapping UrlMapping
	err := col.FindOne(ctx, bson.M{"short_url": path}).Decode(&urlMapping)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(urlMapping)
	if err != nil {
		http.Error(w, "Could not write long url as json response!", http.StatusInternalServerError)
		return
	}
	log.Print("Successfully responded to request of long url!")
}

func addLinkMapping(w http.ResponseWriter, r *http.Request) {
	log.Print("Request with URI " + r.RequestURI + " received!")
	if r.Method != http.MethodPost {
		http.Error(w, "Bad request, post request needed!", http.StatusBadRequest)
		return
	}
	var request LinkAddRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Bad request, invalid request body!", http.StatusBadRequest)
		return
	}
	if !strings.HasPrefix(request.URL, "http://") &&
		!strings.HasPrefix(request.URL, "https://") {
		request.URL = "http://" + request.URL
	}
	ctx, cancel := setupDB()
	defer cancel()
	var urlMapping UrlMapping
	err = col.FindOne(ctx, bson.M{"long_url": request.URL}).Decode(&urlMapping)
	if err == nil {
		w.WriteHeader(http.StatusOK)
		_, err = w.Write([]byte(fmt.Sprintf("Short url added: %s", urlMapping.ShortURL)))
		log.Print("Successfully added new short url!")
		return
	}
	var count int64 = 1
	var shortUrl string
	for count != 0 {
		shortUrl = shortenUrl(request.URL + string(rune(rand.Intn(100))))
		count, _ = col.CountDocuments(ctx, bson.M{"short_url": shortUrl})
	}
	mapping := UrlMapping{ShortURL: shortUrl, LongURL: request.URL}
	_, err = col.InsertOne(ctx, mapping)
	if err != nil {
		http.Error(w, "Failed to save data!", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	_, err = w.Write([]byte(fmt.Sprintf("Short url added: %s", mapping.ShortURL)))
	if err != nil {
		http.Error(w, "Failed to write response!", http.StatusInternalServerError)
	}
	log.Print("Successfully added new short url!")
}

func main() {
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})
	log.SetOutput(os.Stdout)
	log.SetFlags(log.Ldate | log.Ltime)
	log.Print("Backend started!")
	mux := http.NewServeMux()
	mux.HandleFunc("/", getLinkMapping)
	mux.HandleFunc("/api/add", addLinkMapping)
	handler := c.Handler(mux)
	err := http.ListenAndServe(":4000", handler)
	if err != nil {
		log.Fatal(err)
	}
}
