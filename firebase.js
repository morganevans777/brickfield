var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyCMyM-4Pe80L_lgrL2Dq1TOIua6Vilthog",
    authDomain: "practice-5ca25.firebaseapp.com",
    databaseURL: "https://practice-5ca25.firebaseio.com",
    storageBucket: "practice-5ca25.appspot.com",
  };
  firebase.initializeApp(config);
  console.log('firebase initialized')

    exports.fetchData = function(category, callback) {
        var allData = [];
        
        if(category === 'all'){
            return firebase.database().ref('/').once('value').then(function(snapshot) {
            if(snapshot) {
                for(var category in snapshot.val()){
                    for(var id in snapshot.val()[category]){
                        allData.push({id: id,category: category ,title: snapshot.val()[category][id].title, description: snapshot.val()[category][id].description})
                    }
                }
                callback(allData)
            } else {
                callback(allData)
            }
        })
        } else {
            return firebase.database().ref('/' + category).once('value').then(function(snapshot) {
             
            if(snapshot) {
                for(var id in snapshot.val()){
                    allData.push({id: id, title: snapshot.val()[id].title, description: snapshot.val()[id].description });
                }
                callback(allData)
            } else {
                callback(allData)
            }
        })
        }
    
}

exports.login = function(email, password, callback) {
    
    return firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
        callback(user, undefined);
    }).catch(function(error) {

        var errorCode = error.code;
        var errorMessage = error.Message;

        callback(undefined, error)
        if (errorCode === 'auth/wrong-password') {
            // alert('Wrong password.');
            console.log('wrong password')
        } else {
            // alert('errorMessage')
        }
    })
}

//Morgans code//

exports.logOut = function( callback) {
    return firebase.auth().signOut().then(function(res) {
        callback(res, undefined)
    }).catch(function(error) {
        console.log(error);
        callback(undefined, error)
    })
}

//Morgans code

exports.update = function(category, id, data) {
    console.log(id, category, data)
    return firebase.database().ref('/' + category + '/' + id).set(data);
}

exports.writeData = function(category, data, callback) {
   return firebase.database().ref('/' + category).push('/' + category + '/').set(data).then(function(res){
    callback(res, undefined);
    console.log(category, data, 'writeData')
    
   }).catch(function(err){
       callback(undefined, err)
   });
}

exports.fetchDataById = function(category, id, callback) {
        return firebase.database().ref('/' + category + '/' + id).once('value').then(function(snapshot) {
            var allData = [];
        if(snapshot) {
            callback(snapshot.val())
        } else {
            callback(allData)
        }
    });

}

exports.remove = function(category, id) {
    return firebase.database().ref('/' + category + '/' + id).remove()
    console.log(category, id)
}