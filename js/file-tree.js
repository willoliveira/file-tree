(function($){

  var defaultOptions = {
    templates: {
      containerParent: "<ul class=\"container-parent\">",
      containerChild: "<ul class=\"container-childs\">",
      child: "<li><input class=\"checkButton\" type=\"checkbox\"/></li>"
    }
  },
    FileTreeOptions;

  //
  $.fn.fileTree = FileTree;

  function FileTree(options) {
    console.log(options);
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

  }

})(jQuery)
