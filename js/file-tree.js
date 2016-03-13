(function($){

  var defaultOptions = {
    templates: {
      containerParent: "<ul class=\"container-parent\">",
      containerChild: "<ul class=\"container-childs\">",
      child: "<li class=\"line\"><input class=\"checkButton\" type=\"checkbox\"/><ul class=\"container-childs\"></li>"
    }
  },
    FileTreeOptions;

  //
  $.fn.fileTree = FileTree;

  function FileTree(options) {
    console.log(options, this);
    containerParent = this;
    //se estiver dando um start no fileTree
    if (typeof options == "object" || typeof options == "undefined") {
      //configura o plugin
      //da um merge com as prop default
      FileTreeOptions = $.extend({}, defaultOptions, options);
      //inicia o plugin
      init();
    }
    return this;
  }

  function init() {
    //Limpa a div e adiciona o container inicial
    document.getElementById("fileTree").innerHTML = FileTreeOptions.templates.containerParent;
    //cria os nós
    FileTreeOptions.data.forEach(function(element, index) {
      addNode(element);
    });
  }

  function addNode(node) {
    if (!node.idParent) {
      var container = ".container-parent";
      cont = $(containerParent).children(".container-parent");
    } else
      cont = $("#" + node.idParent + ".line > .container-childs");
    //adiciona uma li
    var $line = $(FileTreeOptions.templates.child).attr({id: node.id});
    //add click no check
    $line.find(".checkButton").bind("mousedown", clickCheck.bind(this, node));
    //adiciona o filho
    $(cont).append($line);
  }

  function clickCheck(node) {
    console.log("clickCheck", node);
  }

})(jQuery);
