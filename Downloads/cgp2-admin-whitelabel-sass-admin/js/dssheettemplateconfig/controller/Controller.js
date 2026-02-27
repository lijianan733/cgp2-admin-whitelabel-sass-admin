/**
 * Created by admin on 2019/4/10.
 */
Ext.define("CGP.dssheettemplateconfig.controller.Controller",{
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
            url = adminPath + 'api/dynamicsize/sheettemplates';
            if(pageTemplateConfig != null &&
                pageTemplateConfig.modelName == "CGP.dssheettemplateconfig.model.SheetTemplateConfig"
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
                            var htmlUrl =  path + "partials/dssheettemplateconfig/edit.html?id=" + id;
                            JSOpen({
                                id : "dssheettemplateconfig_edit",
                                url :  htmlUrl,
                                title: i18n.getKey('edit') +"_"+ i18n.getKey('dssheettemplateconfig'),
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
    searchGridCombo: function () {
        var queries = [];

        var items = this.ownerCt.items.items;

        var store = this.ownerCt.ownerCt.getStore();

        var params = {};

        for (var i = 0; i < items.length; i++) {
            var query = {};
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            query.name = items[i].name;
            if (!Ext.isEmpty(items[i].isLike) && !items[i].isLike) {
                query.value = items[i].getValue();
            } else if (Ext.isEmpty(items[i].isLike) || items[i].isLike) {
                query.value = '%' + items[i].getValue() + '%'
            }
            query.type = 'string';
            queries.push(query);
        }

        if (queries.length > 0) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(queries)
            }
        } else {
            store.proxy.extraParams = null;
        }
        store.loadPage(1);
    },
    clearParams: function () {
        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();
        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }
        store.proxy.extraParams = null;
    }

});