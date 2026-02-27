Ext.define('CGP.mailhistory.controller.Controller',{
    totalValue: 100,
    resendMailHistory: function(data,id,window){
        var lm = window.setLoading();
        Ext.Ajax.request({
            url: adminPath + 'api/mailHistories/send',
            jsonData: {
                "subject":data['subject'],
                "text":data['text'],
                "to":data['to'],
                "attachments":data['attachments'],
                "websiteId": data['websiteId'],
                "mailSender": data['mailSender'],
                "from": data['from']
            },
            method: 'POST',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                lm.hide();
                var response = Ext.JSON.decode(res.responseText);
                if(response.success == true){
                    Ext.Msg.alert('提示','发送成功！',function close(){
                        window.close();
                    })
                }else{
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function(resp){
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }

        })
    },
    setAttachmentsValue: function(data,panel){
        var me = this;
        for(var i = 0;i<data.length;i++){
            var upLoadId = data[i].id ;
            var fileName = data[i].name;
            me.setSingleValue(fileName,upLoadId,panel);
        }
    },
    setSingleValue : function(fileName,upLoadId,panel,name){
        var me = this;
        me.totalValue = me.totalValue + 1;
        var imgurl = '../../ClientLibs/extjs/resources/themes/images/shared/fam/cross.png';
        var totalValue = me.totalValue;
        var id = "addresseeEmail_"+totalValue;
        var objDisplay = {
            id : id,
            width : 300,
            height: 30,
            name: name,
            hideLabel : true,
            uploadId: upLoadId,
            value : "<div id = '"+id+"' class='emailDiv'>"+fileName+" <img src='"+imgurl+"' onclick='editController.deleteEmail(\""+id+"\")'/></div>"
        };
        var displayField = new Ext.form.field.Display(objDisplay);
        panel.add(displayField);
    }
})