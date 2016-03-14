(function($){
  /**
  TODO:
  - fazer uma referencia do checkbox na criação do nó e guardar uma referencia
  */
  "use strict";
  var defaultOptions = {
    templates: {
      containerParent: "<ul class=\"container-parent\">",
      containerChild: "<ul class=\"container-childs\">",
      child: "<li class=\"line\"><input class=\"checkButton\" type=\"checkbox\"/><ul class=\"container-childs\"></li>"
    },
    data: {},
    arrSelected: []
  },
    FileTreeOptions,
    containerParent;

  //
  $.fn.fileTree = FileTree;

  function FileTree(options) {
    console.log(options, this);
    containerParent = this;
    //se estiver dando um start no fileTree
    if (typeof options == "object" || typeof options == "undefined") {
      let initialData = options.initialData;
      delete options.initialData;
      //configura o plugin
      //da um merge com as prop default
      FileTreeOptions = $.extend({}, defaultOptions, options);
      //inicia o plugin
      init(initialData);
    }
    return this;
  }

  function init(initialData) {
    //Limpa a div e adiciona o container inicial
    document.getElementById("fileTree").innerHTML = FileTreeOptions.templates.containerParent;
    //formata os dados
    formatNodes(initialData);
    //cria os nós
    for (var index in FileTreeOptions.data) {
      addNode(FileTreeOptions.data[index]);
    };
  }

  function formatNodes(arrData) {
    arrData.forEach(function(element, index) {
      //adiciona no objeto
      FileTreeOptions.data["node-" + element.id] = element;
      //adiciona um array para adicionar referencia para os filhos
      FileTreeOptions.data["node-" + element.id].childs = [];
      FileTreeOptions.data["node-" + element.id].check = false;
    });
  }

  function addNode(node) {
    let container, $line, $checkbox;
    //se não houver parent
    if (!node.idParent) {
      container = $(containerParent).children(".container-parent");
    } else {
      container = $("#node-" + node.idParent + ".line > .container-childs");
      //se tem um pai, adiciona voce como filho nele
      FileTreeOptions.data["node-" + node.idParent].childs.push(node.id);
    }
    //adiciona uma li
    $line = $(FileTreeOptions.templates.child).attr({id: "node-" + node.id});
    //add click no check
    $checkbox = $line.find(".checkButton")
    $line.find(".checkButton").bind("click", clickCheck.bind($checkbox, node, undefined));
    //adiciona o filho
    $(container).append($line);
  }

  function clickCheck(node, forceCheck) {
    var isForced = typeof forceCheck != 'undefined';
    //se um parent foi clickado, o check é forçado
    if (isForced) node.check = forceCheck;
      //senao, faz o inverso do check atual
    else node.check = !node.check;
    //pega o check button do nó atual
    var $node = $(this);
    $node.prop("checked", node.check);
    //se houver filhos, varre os filhos, chama a mesma função recursivamente
    if (node.childs.length) {
        node.childs.forEach(function(i){
          let $node = $("#node-" + i + " > .checkButton");
          clickCheck.call($node, FileTreeOptions.data["node-" + i], node.check);
        });
    }
    //se houver um parent
    if (!isForced && node.idParent) {
      let $parent = $("#node-" + node.idParent + " > .checkButton");
      if(node.check) checkParent.call($parent, FileTreeOptions.data["node-" + node.idParent], node.check);
    }
    //isso vai ser tenso..
    FileTreeOptions.arrSelected.push(node.id);
  }

  function checkParent(node, isChecked) {
    console.log(this);
    var $checkBox = $(this);
    if (node.idParent) {
      let $nodeParent = $("#node-" + node.idParent + " > .checkButton");
      checkParent.call($nodeParent, FileTreeOptions.data["node-" + node.idParent], isChecked);
    }
  }























})(jQuery);
