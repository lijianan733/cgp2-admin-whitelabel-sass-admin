Ext.define('CGP.orderlineitem.view.jobtaskdistribute.controller.Controller', {
    checkLog:function (datas){
        var win = Ext.create("Ext.window.Window", {
            itemId: "logWindow",
            title: i18n.getKey('status')+i18n.getKey('log'),
            modal: true,
            bodyPadding: 10,
            width:700,
            height:350,
            layout: 'fit',
            items: [
                Ext.create('CGP.orderlineitem.view.jobtaskdistribute.view.StatusLog',{
                    itemId:'statusLog',
                    data:datas
                })
            ]
        });
        win.show();
    },
    setStatus:function (record,store){
        var url = cgp2ComposingPath + 'api/jobTasks/'+record.get('_id')+'/distribute/repetition';
        var method = "POST";

        Ext.Ajax.request({
            url : url,
            method : method,
            jsonData : null,
            success : function(response,options){
                var resp = Ext.JSON.decode(response.responseText);
                if(resp.success){
                    Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('execute')+i18n.getKey('success'))
                    store.reload();
                }else{
                    Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure')+resp.data.message)
                }
            },
            failure : function(response,options){
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure') + object.data.message);
            },
            callback : function(){
            }
        });
    },

    showRetry:function (status,logs){
        var runningTime=0;
        if(status=='RUNNING'&&!Ext.isEmpty(logs)){
            var latest=Math.max.apply(Math,logs.map(item => { return item.status=='RUNNING'?item.modifiedDate:0 }));
            runningTime=Date.parse(new Date())-latest;
        }
        return !(status== 'FAILURE'||status== 'WAITING'||(status== 'RUNNING'&&runningTime>1800000));
    }
})