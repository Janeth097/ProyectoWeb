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
            "<h4>"+ tweetContent + "</h4>" +
            "<span class='pull-right has-text-grey-light'><i class='fa fa-comments'></i> 1</span>"+
            "<div class='media'>"+
              "<div class='content'>"+
                "<p>"+
                  "<a href='/tweet/detail/'"+tweetId+"'/'>View</a> "+" | "+tweetUser+ "&nbsp;"+ "|" +
                  tweetDateDisplay+ " | "+
                "</p>"+
              "</div>"+
            "</div>"
        )
      }else{
        $("#ajax_tweets").append(
            "<h4>"+ tweetContent + "</h4>" +
            "<span class='pull-right has-text-grey-light'><i class='fa fa-comments'></i> 1</span>"+
            "<div class='media'>"+
              "<div class='content'>"+
                "<p>"+
                  "<a href='/tweet/detail/"+tweetId+"'/'>View</a> "+" | "+tweetUser+ "&nbsp;"+ "|" +
                  tweetDateDisplay+ " | " +"<a href='/tweet/detail/"+tweetId+"/edit'>Edit</a> "+
                    " | " +"<a href='/tweet/detail/"+tweetId+"/delete'>Borrar</a> "+
                "</p>"+
              "</div>"+
            "</div>"
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

    var charsStart = 140;
    var charsCurrent = 0;

    $("#tweet-form").append("<span id='tweetCharLeft'>"+charsStart+"</span>")
    $("#tweet-form textarea").keyup(function(event){
      var tweetValue = $(this).val();
      charsCurrent = charsStart - tweetValue.length;
      console.log(tweetValue.length);
      var spanChars = $("#tweetCharLeft");
      spanChars.text(charsCurrent);
      if(charsCurrent > 0){
          spanChars.removeClass("gray-color");
          spanChars.removeClass("red-color");
      }else if (charsCurrent == 0){
        spanChars.removeClass("red-color");
        spanChars.addClass("gray-color");
      }else if (charsCurrent < 0){
        spanChars.removeClass("gray-color");
        spanChars.addClass("red-color");
      }
    });

    $("#tweet-form").submit(function(event){
      event.preventDefault();
      var this_ = $(this);
      console.log(event);
      console.log(this_.serialize());
      var formData = this_.serialize();
      if (charsCurrent >= 0){
        $.ajax({
          url: "/api/tweet/create/",
          data:formData,
          method: "POST",
          success: function(data){
            this_.find("#id_content").val("");
            attachTweet(data, true);
          },
          error: function(data){
            console.log("error");
            console.log(data);
            console.log(data.statusText);
            console.log(data.status);
          }
        });
      }else{
        alert("El tweet es demasiado largo!!!");
      }
    })
  });
