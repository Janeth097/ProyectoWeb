function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

  $(document).ready(function(){
    var query = getParameterByName('q');
    console.log(query);
    var nextTweetUrl;

    function attachTweet(tweetValue, prepend){
      var tweetDateDisplay = tweetValue.timesince;
      var tweetContent = tweetValue.content;
      var tweetUser = tweetValue.user.username;
      var tweetId = tweetValue.id;
      if (prepend==true){
        $("#ajax_tweets").prepend(
          "<span class='card' style='width: 20rem; margin: 30px; border: 5px solid darkgray; border-radius: 5px;'>" +
      "<img data-src='#' alt='" + tweetUser + "'>" +
      "<div class='card-body'>"+
      "<h4 class='card-title'>" + tweetContent +"</h4>"+
      "<p>" + tweetDateDisplay +"</p>"+
      "</div>"+
      "</span>"
        )
      }else{
        $("#ajax_tweets").append(
          "<span class='card' style='width: 20rem; margin: 30px; border: 5px solid darkgray; border-radius: 5px;'>" +
      "<img data-src='#' alt='" + tweetUser + "'>" +
      "<div class='card-body'>"+
      "<h4 class='card-title'>" + tweetContent +"</h4>"+
      "<p>" + tweetDateDisplay +"</p>"+
      "</div>"+
      "</span>"
        )
      }
    }
    function fetchTweets(url){
      console.log("fetching...");
      var fetchUrl;
      if (!url){
        fetchUrl='/api/tweet/?q=somequery';
      }else{
        fetchUrl=url
      }

      $.ajax({
        url: fetchUrl,
        data:{
          'q': query
        },
        method: "GET",
        success: function(data){
          // console.log(data);
          nextTweetUrl = data.next;
          $.each(data.results, function(key, value){
            var tweetKey = key;
            attachTweet(value);
          });
        },
        error: function(data){
          console.log("error");
          console.log(data);
        }
      });
    }

    fetchTweets();

    $("#loadmore").click(function(event){
      event.preventDefault();
      console.log("click me")
      if (nextTweetUrl){
        fetchTweets(nextTweetUrl);
      }
    })
  });
