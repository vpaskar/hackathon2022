package pochacki

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	eventingv1a1 "github.com/kyma-project/kyma/components/eventing-controller/api/v1alpha1"
	// xyz "function src"
)

var Subscriptions []eventingv1a1.Subscription //crud
//var Functions []xyz.Function //crud
//logs //get
//cloudevents //get

func main() {
	handleRequests()
}

func handleRequests() {
	r := mux.NewRouter().StrictSlash(true)
	r.HandleFunc("{ns}/subs/{name}", postSub).Methods("POST")
	r.HandleFunc("{ns}/subs/{name}", getSub).Methods("GET")
	r.HandleFunc("{ns}/subs/{name}", putSub).Methods("PUT")
	r.HandleFunc("{ns}/subs/{name}", delSub).Methods("DELETE")

	r.HandleFunc("{ns}/funcs/{name}", postFuncs).Methods("POST")
	r.HandleFunc("{ns}/funcs/{name}", getFuncs).Methods("GET")
	r.HandleFunc("{ns}/funcs/{name}", putFuncs).Methods("PUT")
	r.HandleFunc("{ns}/funcs/{name}", delFuncs).Methods("DELETE")

	log.Fatal(http.ListenAndServe(":8000", r))
}

func subs(w http.ResponseWriter, r *http.Request) {
	//GET all
	for _, s := range Subscriptions {
		json.NewEncoder(w).Encode(s)
	}
}

func postSub(w http.ResponseWriter, r *http.Request) {

}
func getSub(w http.ResponseWriter, r *http.Request) {

}
func putSub(w http.ResponseWriter, r *http.Request) {

}
func delSub(w http.ResponseWriter, r *http.Request) {

}
func postFuncs(w http.ResponseWriter, r *http.Request) {

}
func getFuncs(w http.ResponseWriter, r *http.Request) {

}
func putFuncs(w http.ResponseWriter, r *http.Request) {

}
func delFuncs(w http.ResponseWriter, r *http.Request) {

}
