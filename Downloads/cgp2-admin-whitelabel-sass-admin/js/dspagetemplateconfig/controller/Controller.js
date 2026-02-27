/**
 * Created by admin on 2019/4/10.
 */
Ext.define("CGP.dspagetemplateconfig.controller.Controller",{
    /*
    *
    * */
    addPageTemplateConfigWin:function(items, pageTemplateConfig, mask){
        var me = this, method = "POST",url;
        Ext.Array.each(items, function (item) {
        var jsonData ;
        if(!Ext.isEmpty(item)&& typeof item === 'string') {
            try {
                jsonData = JSON.parse(item);
            } catch(e) {
                Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('illlegal json'));
                mask.hide();// error in the above string (in this case, yes)!
                return;
            }
        }
        else{
            jsonData=item;
        }
//		object.promotionId = 1;
        url = adminPath + 'api/dynamicsize/pagetemplates';
        if(pageTemplateConfig != null &&
            pageTemplateConfig.modelName == "CGP.dspagetemplateconfig.model.Dspagetemplateconfig"
            && pageTemplateConfig.getId() != null){

            jsonData._id = pageTemplateConfig.get("_id");
            method = "PUT";
            url = url+"/"+jsonData._id;
        }

        Ext.Ajax.request({
            url : url,
            method : method,
            headers : {
                Authorization: 'Bearer '+ Ext.util.Cookies.get('token')
            },
            jsonData : jsonData,
            success : function(response,options){
                var resp = Ext.JSON.decode(response.responseText);
                if(resp.success){
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveSuccess'),function(){
                        var id = resp.data._id;
                        var htmlUrl =  path + "partials/dspagetemplateconfig/edit.html?id=" + id;
                        JSOpen({
                            id : "dspagetemplateconfig_edit",
                            url :  htmlUrl,
                            title: i18n.getKey('edit') +"_"+ i18n.getKey('dspagetemplateconfig'),
                            refresh: true
                        });
                    });
                }else{
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure')+resp.data.message)
                }
            },
            failure : function(response,options){
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure') + object.data.message);
            },
            callback : function(){
                mask.hide();
            }
        });
        });
    },

    editPageTemplateConfig: function (data, store, editOrNew) {
        var me = this;
        Ext.create('CGP.dspagetemplateconfig.edit', {
            store: store,
            data: data,
            controller: me,
            editOrNew: editOrNew
        }).show();
    },
    deletePageTemplateConfig: function (pageTemplateConfigId, store) {
        Ext.Msg.confirm('提示', '是否删除？', callback);
        function callback(id) {
            if (id === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/dynamicsize/pagetemplates/' + pageTemplateConfigId,
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var success = response.success;
                        if (success) {
                            store.load();
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                })
            }
        }
    }
 });