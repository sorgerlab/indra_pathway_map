var default_colors = ['#fdbb84','#fee8c8','#e34a33', '#3182bd', '#000000']
//0-4 are greens, 5 is a grey
//var exp_colorscale = ['#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c', '#bdbdbd']

var cy = cytoscape();

// {name : position} dict
var preset_pos = {};
var preset_pos_static = {}

// {id : position} dict
var id_pos = {};

var scapes = {};

var indra_server_addr = "http://ec2-52-55-90-184.compute-1.amazonaws.com:8080"

$(function(){

  var win = $(window);

  // build the dropdown pickers
  grabJSON('static/cell_dict.json').then(
    function(ajax_response){

      var interesting_lines = {"A101D_SKIN":"model_A101D_SKIN.json", "LOXIMVI_SKIN":"model_LOXIMVI_SKIN.json"};
      for (d of ['#cellSelectStatic', '#cellSelectDynamic']) {
          dropdownFromJSON(d, interesting_lines)
          $(d).append($('<option data-divider="true"/>'))
        }

      for (d of ['#cellSelectStatic', '#cellSelectDynamic']) {
          dropdownFromJSON(d, ajax_response)
        }

      }
  )

  // set the preset_pos
  setPresetPos()




  $("#loadButtonDynamic").click(function(){
    var txt = $('#textArea')[0].value

    txtReach(txt).then(groundingMapper).then(assembleCyJS).then(function (model_response) {
      drawCytoscape ('cy_1', model_response)
    });
    // txtReach(txt).then(assembleCyJS).then(function (model_response) {
    //   drawCytoscape ('cy_1', model_response)
    // });
    $('.cyjs2loopy').prop('disabled', false);
    console.log($('#cellSelectDynamic').val().substring(6));
  });

  $("#downloadPySB").click(function(){
    var txt = $('#textArea')[0].value

    txtReach(txt).then(groundingMapper).then(assemblePySB).then(function (res) {
      download($('#cellSelectDynamic').val()+'_PySB.json', JSON.stringify(res, null, 2))
    });
    // txtReach(txt).then(assembleCyJS).then(function (model_response) {
    //   drawCytoscape ('cy_1', model_response)
    // });

    console.log($('#cellSelectDynamic').val().substring(6));
  });


  $("#downloadINDRA").click(function(){
    var txt = $('#textArea')[0].value

    txtReach(txt).then(groundingMapper).then(function (res) {
      download($('#cellSelectDynamic').val()+'_INDRA_stmts.json', JSON.stringify(res, null, 2))
    });
    // txtReach(txt).then(assembleCyJS).then(function (model_response) {
    //   drawCytoscape ('cy_1', model_response)
    // });

    console.log($('#cellSelectDynamic').val().substring(6));
  });

  $("#loopy").click(function(){
    var txt = $('#textArea')[0].value

    txtReach(txt).then(groundingMapper).then(assembleLoopy).then(function (res) {

        window.open(
          res['loopy_url'].toString(),
          "_blank"
        );

    });

    console.log($('#cellSelectDynamic').val().substring(6));
  });


$("#loadButtonStatic").click(function(){

  setPresetPos()

  function getModel() {
    return $.ajax({
      url: 'static/cyjs/' + $('#cellSelectStatic').val(),
    });
  }

  //txtReach(txt).then(groundingMapper).then(assembleCyJS).then(drawCytoscape);
  getModel().then(function (model_response) {
    drawCytoscape ('cy_1', model_response)
  });

  $('.cyjs2loopy').prop('disabled', false);
  console.log($('#cellSelectDynamic').val().substring(6));
});

$(".cyjs2loopy").click(function(){

  var model = loopyFromCyJS("cy_1");
  console.log(model)
  window.open(
    'http://ncase.me/loopy/v1/?data=' + model,
    "_blank"
  );

});

$(".presetLayout").click(function(){
  // console.log(this)
  if (this.classList.contains("active")){
    $(".presetLayout").removeClass("active")
    preset_pos = {}
  }
  else {
    $(".presetLayout").addClass("active")
    preset_pos = preset_pos_static
  }

})

$('a[href="#byom"]').click(function(){
  if (this.classList.contains("active") === false){
    preset_pos = {}
  }
  console.log(preset_pos)
})

$('a[href="#ras227"]').click(function(){
  preset_pos = preset_pos_static
  console.log(preset_pos)
})

// destroy cy on tab change
// don't really want this
// $('a[data-toggle=tab]').click(function(){
//     cy.destroy();
//     console.log(this.href);
// });

// get all divs of class cy
// get their data-url location
// draw them!
// $('.cy').each(function(){
//     var div_id = $(this).attr('id')
//     console.log(div_id)
//     var data_model = $(this).attr('data-url')
//     console.log(data_model)
//     grabJSON(data_model).then(function (model_response){
//         drawCytoscape(div_id, model_response)
//     })
//     console.log($(this).attr('data-url'))
// })

  function resize() {
    //console.log(win.height(), win.innerHeight());
    $(".cy-container").height(win.innerHeight() - 0);
    //cy.fit();
    //cy.resize();
  }

  setTimeout(resize, 0);

  win.resize(function() {
    resize();
  });

// cy.edges().forEach(function(e){
//   var g = e.data('weight');
//   e.qtip({
//     content: [
//       {
//         name: g,
//         url:  g
//       }
//     ].map(function( link ){
//       return '<a target="_blank" href="' + link.url + '">' + link.name + '</a>';
//     }).join('<br />\n'),
//     position: {
//       my: 'top center',
//       at: 'top center'
//     },
//     style: {
//       classes: 'qtip-blue',
//       tip: {
//         width: 16,
//         height: 8
//       }
//     }
//   });
// });


});// dom ready