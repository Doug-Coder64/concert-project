var genreObject = {
    "Front-end": {
      "HTML": ["Links", "Images", "Tables", "Lists"],
      "CSS": ["Borders", "Margins", "Backgrounds", "Float"],
      "JavaScript": ["Variables", "Operators", "Functions", "Conditions"]
    },
    "Back-end": {
      "PHP": ["Variables", "Strings", "Arrays"],
      "SQL": ["SELECT", "UPDATE", "DELETE"]
    }
  }
  window.onload = function() {
    var genreSel = document.getElementById("genre");
    var priceSel = document.getElementById("price range");
    var beginningSel = document.getElementById("beginning date");
    for (var x in genreObject) {
      genreSel.options[genreSel.options.length] = new Option(x, x);
    }
    genreSel.onchange = function() {
      //empty Chapters- and prices- dropdowns
      chapterSel.length = 1;
      priceSel.length = 1;
      //display correct values
      for (var y in genreObject[this.value]) {
        priceSel.options[priceSel.options.length] = new Option(y, y);
      }
    }
    priceSel.onchange = function() {
      //empty Chapters dropdown
      chapterSel.length = 1;
      //display correct values
      var z = genreObject[genreSel.value][this.value];
      for (var i = 0; i < z.length; i++) {
        chapterSel.options[chapterSel.options.length] = new Option(z[i], z[i]);
      }
    }
  }