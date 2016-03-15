(function($){
  /**
  TODO:
  - revisar o código e retirar possiveis ambiguidades
  - deixar os parametros dos nós configuraveis. Ex: [id, idParent, childs...]
  - fazer a funcionalidade de adicionar mais nós em tempo de execução
    . checkar os nós recem-adicionados caso os parents estiverem checkados
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
    var container,
      $node, $checkbox, $containerChilds,
      nodeCache = FileTreeOptions.data["node-" + node.id];
    //se não houver parent
    if (!node.idParent) {
      container = $(containerParent).children(".container-parent");
    } else {
      container = $("#node-" + node.idParent + ".line > .container-childs");
      //se tem um pai, se adiciona como filho nele
      FileTreeOptions.data["node-" + node.idParent].childs.push(node.id);
    }
    //cria o no html para o filho
    $node = $(FileTreeOptions.templates.child).attr({id: "node-" + node.id});
    //pega a referencia do checkbox
    $checkbox = $node.find(".checkButton");
    //pega a referencia do container-childs
    $containerChilds = $node.find(".container-childs");
    //guarda os elementos html do componente
    nodeCache.elements = {
        $checkButton: $checkbox,
        $node: $node
    }
    //add click no check
    $checkbox.bind("click", clickCheck.bind($checkbox, node, undefined));
    //adiciona o filho
    $(container).append($node);
  }

  function clickCheck(node, forceCheck) {
    var isForced = typeof forceCheck != 'undefined';
    //se um parent foi clickado, o check é forçado
    if (isForced) node.check = forceCheck;
      //senao, faz o inverso do check atual
    else node.check = !node.check;
    //tira o check parcial caso for check true
    if (node.check)
      node.elements.$checkButton.prop("indeterminate", false);
    //pega o check button do nó atual
    var $node = $(this);
    $node.prop("checked", node.check);
    //se houver filhos
    if (node.childs.length) {
      //varre os filhos, chama a mesma função recursivamente
        node.childs.forEach(function(i){
          let $node = $("#node-" + i + " > .checkButton");
          clickCheck.call($node, FileTreeOptions.data["node-" + i], node.check);
        });
    }
    //se houver um parent e nao for um check forçado
    if (!isForced && node.idParent) {
      let $parent = $("#node-" + node.idParent + " > .checkButton");
      //chama a função que vai atras do parents para checkar os pais
      checkParent.call($parent, FileTreeOptions.data["node-" + node.idParent], node.check);
    }
    //isso vai ser tenso..
    //FileTreeOptions.arrSelected.push(node.id);
  }

  function checkParent(node, isChecked) {
    var $node = node.elements.$node,
        $checkBox = node.elements.$checkButton,
        checkCont = 0,
        checkPartial = false;
    //varre os filhos em busca dos checkados ou parcialmente checkados
    for (let cont = 0; cont < node.childs.length; cont++) {
      let childCache = FileTreeOptions.data["node-" + node.childs[cont]];
      //verifica todos os checkbuttons irmaos checkados
      if ($(childCache.elements.$checkButton).is(":checked")) {
        checkCont += 1;
      }
      //caso contrario, verifica se ele está com check parcial, se estiver, entao o parent automaticamente ficará com check parcial também
      else if ($(childCache.elements.$checkButton).is(":indeterminate")) {
        checkPartial = true;
        break;
      }
    }
    //se os checks irmaos forem todos checkaodos, checka o parent
    if (checkCont == node.childs.length) {
      $checkBox.prop("checked", true);
      $checkBox.prop("indeterminate", false);
    }
      //se tiver nenhum checkado
    else if (!checkCont && !checkPartial) {
      $checkBox.prop("indeterminate", false);
      $checkBox.prop("checked", false);
    }
      //senao, da um checkparcial
    else {
      $checkBox.prop("indeterminate", true);
      $checkBox.prop("checked", false);
    }
    //se houver um pai, chama recursivamente a funcao
    if (node.idParent) {
      //pega uma referencia do html desse check
      let $nodeParent = $("#node-" + node.idParent + " > .checkButton");
      //chama a funcao novamente passando o parente como parametro
      checkParent.call($nodeParent, FileTreeOptions.data["node-" + node.idParent], isChecked);
    }
  }

})(jQuery);
