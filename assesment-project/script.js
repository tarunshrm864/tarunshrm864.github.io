
function printFilms(data,vote){

  var fList = $(".filmList")
  var template = $("#film-template").html();
  var comp = Handlebars.compile(template);
  var film = comp(data);
  var item = $(film);

  // stars

  var stars = item.find("li.stars .sp").children(".fa-star");

  for (var i = 0; i < vote; i++) {
    stars.eq(i).addClass("accesa");
  }

  item.appendTo(fList);

}

function getFlag(lang){

  switch (lang) {
    case "en":
      return "img/Great Britain.svg";

    case "ja":
      return "img/Japan.svg";

    case "it":
      return "img/Italy.svg";

    case "zh":
      return "img/China.svg";

    default:
    return "";
  }
}

function checkLength(string, chars){

  if ( string.length > chars){
    var newString = ""
    for (var i = 0; i < chars; i++) {
      newString += string[i];
    }
    return newString + " <span class= 'more'>(...)</span>"

  }

  return  string;
}


function getResults(list,type){

  for (var i = 0; i < list.length; i++) {

    var item = list[i];
    var vote = Math.ceil(item.vote_average/2);
    var data = {

      id: item.id,
      format: type,
      rating: vote,
      desc: checkLength(item.overview,250)
    }


    if (item.poster_path != null){

      data.poster = "https://image.tmdb.org/t/p/w342/" + item.poster_path;
    }
    else{
      data.poster = ""
    }



    if(type == "movie"){

      data.title = item.title;
      data.ogtitle = item.original_title;
      data.type = "film"
    }

    else if(type == "tv"){

      data.title = item.name;
      data.ogtitle = item.original_name;
      data.type = "tv-show"
    }


    data.flag = getFlag(item.original_language);
    data.language = item.original_language;

    printFilms(data,vote);
  }
}


function apiCall(search,page,type){

 var outData = {

   api_key: "be7a5b068bb701d40ef499c039960c53",
   language: "en",
   query: search,
   page: page,
  }

  var url = "https://api.themoviedb.org/3/search/" + type;

  $.ajax({

    url: url,
    data: outData,
    method: "GET",

    success: function(inData, state){

      if(page == "" &&  inData.total_pages > 1 ){
        genPages(inData.total_pages);
      }

      if(inData.total_results > 0){

        getResults(inData.results,type);
      }
    },
    error: function(request, state ,error){

      console.log("error");
    }
  })
}

function genPages(pageNum){

  var pages = $(".pages");

  for (var i = 1; i <= pageNum; i++) {

    var data = {
      number: i,
    }

    var template = $("#pages-template").html();
    var comp = Handlebars.compile(template);
    var pNum = comp(data);

    pages.append(pNum);
  }

  pages.children(".page-num").eq(0).addClass("current")
}

function clickPage(){

  var pages = $(".pages");
  var m = $("#movieFolder");
  var t = $("#tvFolder");
  pages.on("click",".page-num",function(){

    var pag = parseInt($(this).text(),10);

    $(".filmList").empty()

    if(m.hasClass("active")){

      apiCall( $("#search-input").val(), pag , "movie");
    }
    else if(t.hasClass("active")){
      apiCall( $("#search-input").val(), pag , "tv");
    }

    pages.children().removeClass("current");
    $(this).addClass("current");
  })

}

function getVal(type){

  var srcImp = $("#search-input");
  $(".filmList").empty();
  $(".pages").empty();
  apiCall(srcImp.val(),"",type);
}

function selectFolder(){

  var section = $(".folders .section");

  section.click(function(){

    if( $(this).is("#movieFolder") ){

      $("#tvFolder").removeClass("active")
      $(this).addClass("active");
      getVal("movie");

    }
    else if ( $(this).is("#tvFolder") ){

      $("#movieFolder").removeClass("active")
      $(this).addClass("active");
      getVal("tv");

    }
  })
}


function clickItem(){

  $(".filmList").on("click",".item",function(event){

    $(".filmList .item").removeClass("flipped");
    $(this).addClass("flipped");

    if( $(event.target).is(".fa-times-circle") ){

      $(this).removeClass("flipped");
    }
  })
}

function getTotalResult(search,type){

 var outData = {

   api_key: "be7a5b068bb701d40ef499c039960c53",
   language: "en",
   query: search,
  }

  var url = "https://api.themoviedb.org/3/search/" + type;

  $.ajax({

    url: url,
    data: outData,
    method: "GET",

    success: function(inData, state){

      var num = "( " + inData.total_results + " )";

      if(type == "movie"){

        var item = $("#movieFolder");

        getTotalResult(search,"tv");
      }

      else if(type == "tv"){

        var item = $("#tvFolder");
        if( $("#movieFolder .resNumb").text()  == "( 0 )" && inData.total_results != 0){
          item.click()
        }
        else{

          $("#movieFolder").click()
        }
        $(".folders").css("pointer-events","auto");
      }

      item.children(".resNumb").text(num);
    },
    error: function(request, state ,error){

      console.log("error");
    }
  })
}

function scrollButton(item){

  $(window).scroll(function() {

    if ($(this).scrollTop()> 700)
     item.addClass("show-up");
    else
     {
      item.removeClass("show-up");
     }
 });

 item.click(function(){

  window.scrollTo({
  top: 0,
  behavior: 'smooth'
});
 })
}

function init(){

  var goUp =$("#goUp");
  scrollButton(goUp);

  var srcImp = $("#search-input");

  srcImp.keyup(function(e){

    if(e.keyCode == 13 ){

    getTotalResult($(this).val(),"movie");
    getVal("movie");
    }
  });

  var btn = $("#searchButton");

  btn.click(function(){

    getTotalResult(srcImp.val(),"movie");
    getVal("movie");
  })

  selectFolder()
  clickPage();
  clickItem();

}

$(document).ready(init)
