/**
 * Created by admin on 2019/4/10.
 */
Ext.define("CGP.dsrequesttemplate.controller.Controller",{
    addPageTemplateConfigWin:function(items, dataSource, mask){
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
            url = adminPath + 'api/dynamicsize/requesttemplates';
            if(dataSource != null &&
                dataSource.modelName == "CGP.dsrequesttemplate.model.RequestTemplate"
                && dataSource.getId() != null){

                jsonData._id = dataSource.get("_id");
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
                            var htmlUrl =  path + "partials/dsrequesttemplate/edit.html?id=" + id;
                            JSOpen({
                                id : "dsrequesttemplate_edit",
                                url :  htmlUrl,
                                title: i18n.getKey('edit') +"_"+ i18n.getKey('dsrequesttemplate'),
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
    }

});