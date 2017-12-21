$(function () { $("[data-toggle='tooltip']").tooltip(); });
var tbody = $('tbody')
$('#btn').on('click', function(){
  tbody.empty()
  var list = eval($('#ipt').val())
  list.forEach(function(ele){
    $.get('/getMusic?id=' + ele, function(data){
      var info = JSON.parse(data).info
      if(data == 'error'){
        $(
          '<tr>' +
          '<td></td>' +
          '<td>' + ele + '</td>' +
          '<td colspan="3">生成失败</td>' +
          '</tr>'
        ).appendTo(tbody)
      } else {
        $(
          '<tr>' +
          '<td class="status"><input type="checkbox"></td>' +
          '<td>' + ele + '</td>' +
          '<td>' + info.name + '</td>' +
          '<td>' + formatLength(info.length) + '</td>' +
          '<td class="download-box"><a href="' + info.source + '" download="' + info.name + '.mp3">下载</a></td>' +
          '</tr>'
        ).appendTo(tbody)
      }
    })
  })
})
function checkAll(){
  $(':checkbox', tbody).prop("checked", true)
}
function inverseCheck(){
  $(':checkbox', tbody).each(function () {
    $(this).prop("checked", !$(this).prop("checked"));
  });
}
function deselectAll() {
  $(':checkbox', tbody).prop("checked", false);
}
function downloadCheck(){
  $(':checkbox', tbody).each(function(){
    if($(this).prop("checked")){
      var tr = $(this).parents('tr'), info = tr.children('.download-box').children('a')
      tr.children('.status').empty().append('<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>')
      $.get('/download?downloadPath=' + info.attr('href') + '&fileName=' + info.attr('download'), function(d){
        if(d == 'ok'){
          tr.children('.status').empty().append('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>')
        }
      })
    }
  })
}
function formatLength(length){
  return Math.floor(length / 60 / 60) + ':' + addZero(Math.floor(length / 60 % 60)) + ':' + addZero(Math.floor(length % 60))
}
function addZero(num){
  return num >= 10 ? num : '0' + num
}