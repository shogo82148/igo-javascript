$(function() {
    function event(data) {
        if(data.event=='downloaded') {
            $('#loading').text('辞書を展開中・・・');
        } else if(data.event=='load') {
            $('#loading').hide();
            $('#inputform').show();
        } else if(data.event=="result" && data.method=="parseNBest") {
            var nodeslist = data.morpheme;
            var result = '';
            for(var j=0;j<nodeslist.length;++j) {
                var nodes = nodeslist[j];
                for(var i=0;i<nodes.length;i++) {
                    result += '<div class="morph"><div class="surface">' + nodes[i].surface + '</div><div class="feature">' + nodes[i].feature + '</div></div>';
                }
                result += '<div>EOS</div>';
            }
            $('#result').html(result);
        } else if(data.event=="error") {
            $('#result').text('エラー発生');
        }
    }

    var post;
    if(window.useNodeJS) {
        event({event: 'load'});
        post = function(data) {
            $.ajax(
                {
                    url: 'igo',
                    data: data,
                    success: function(data, datatype) {event(data);},
                    error: function() {event({event:'error'});}
                }
            );
        }
    } else {
        var BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder || window.BlobBuilder;
        var worker = new Worker('web.js');
        igo.getServerFileToArrayBufffer("ipadic.zip", function(buffer) {
            event({event: 'downloaded'});
            var bb = new BlobBuilder();
            bb.append(buffer);
            worker.postMessage({method: 'setdic', dic: bb.getBlob()});
	});
        post = function(data) {
            worker.postMessage(data);
        }
	worker.addEventListener("message", function(e) {event(e.data);});
	worker.addEventListener("error", function() {event({event:"error"});});
    }

    $('#morph').click(function() {
        post({method: 'parseNBest', text: $('#input').val(), best: 3});
    });
});
