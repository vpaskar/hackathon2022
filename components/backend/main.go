package main

import (
	"flag"
	"log"
	"net/http"
	"path/filepath"

	"github.com/gorilla/mux"

	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"

	subscription "github.com/vladislavpaskar/hackathon2022/components/backend/clients"
)


//var Functions []xyz.Function //crud
//logs //get
//cloudevents //get

var subscriptionClient subscription.Client

func main() {
	handleRequests()

	var kubeconfig *string
	if home := homedir.HomeDir(); home != "" && false {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", " /Users/faizan/kubeconfigs/kubeconfig--kymatunas--fw-hackihack.yml", "absolute path to the kubeconfig file")
	}



	flag.Parse()

	k8sConfig, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		log.Fatal(err)
	}

	// Create dynamic client (k8s)
	dynamicClient := dynamic.NewForConfigOrDie(k8sConfig)

	// setup clients
	subscriptionClient = subscription.NewClient(dynamicClient)


	log.Printf("Server listening ...")
}

func handleRequests() {
	r := mux.NewRouter().StrictSlash(true)
	r.HandleFunc("{ns}/subs/{name}", postSub).Methods("POST")
	r.HandleFunc("/subs", getAllSubs).Methods("GET")
	r.HandleFunc("{ns}/subs/{name}", getSub).Methods("GET")
	r.HandleFunc("{ns}/subs/{name}", putSub).Methods("PUT")
	r.HandleFunc("{ns}/subs/{name}", delSub).Methods("DELETE")

	r.HandleFunc("{ns}/funcs/{name}", postFuncs).Methods("POST")
	r.HandleFunc("{ns}/funcs/{name}", getFuncs).Methods("GET")
	r.HandleFunc("{ns}/funcs/{name}", putFuncs).Methods("PUT")
	r.HandleFunc("{ns}/funcs/{name}", delFuncs).Methods("DELETE")

	log.Fatal(http.ListenAndServe(":8000", r))
}

func getAllSubs(w http.ResponseWriter, r *http.Request) {

	subsUnstructured, err := subscriptionClient.ListJson("default")
	if err != nil {
		log.Printf("%s %s failed: %v",r.Method, r.RequestURI , err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	subsBytes, err := subsUnstructured.MarshalJSON()
	if err != nil {
		log.Printf("%s %s failed to marchal json: %v",r.Method, r.RequestURI , err)
	}

	_, err = w.Write(subsBytes)
	if err != nil {
		log.Printf("%s %s failed to write response: %v",r.Method, r.RequestURI , err)
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
