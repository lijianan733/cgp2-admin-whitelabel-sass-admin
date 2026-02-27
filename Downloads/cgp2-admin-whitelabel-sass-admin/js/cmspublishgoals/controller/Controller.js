Ext.define('CGP.cmspublishgoals.controller.Controller',{
    saveCmsPublishGoal: function(items,cmsPublishGoalModel,mask){
        var me = this, method = "POST",url;
        var data = {};
        Ext.Array.each(items,function(item){
            if(item.type == 'query' || item.type == 'filter'){
                item.save(mask);
            }
        });
        Ext.Array.each(items,function(item){
            if(item.xtype == 'gridcombo'){
                data[item.name] = item.getArrayValue();
            }else{
                data[item.name] = item.getValue();
            }
        });
//		object.promotionId = 1;
        url = adminPath + 'api/cmsPublishGoals';
        if(cmsPublishGoalModel != null &&
            cmsPublishGoalModel.modelName == "CGP.cmspublishgoals.model.CmsPublishGoal"
            && cmsPublishGoalModel.get("id") != null){

            data.id = cmsPublishGoalModel.get("id");
            method = "PUT";
            url = url+"/"+data.id;
        }

        Ext.Ajax.request({
            url : url,
            method : method,
            headers : {
                Authorization: 'Bearer '+ Ext.util.Cookies.get('token')
            },
            jsonData : data,
            success : function(response,options){
                var resp = Ext.JSON.decode(response.responseText);
                if(resp.success){
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveSuccess'),function(){
                        var id = resp.data.id;
                        var htmlUrl =  path + "partials/cmspublishgoals/edit.html?id=" + id;
                        JSOpen({
                            id : "cmspublishgoals_edit",
                            url :  htmlUrl,
                            title: i18n.getKey('edit') +"_"+ i18n.getKey('cmspublishgoals'),
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
    },
    managerQueryOrFilter: function(Id,type,title,cmsPublishGoalId){
        var me = this;
        var url;
        if(type == 'query'){
            url = adminPath + 'api/cmsEntityQuery/'+Id
        }else{
            url = adminPath + 'api/cmsEntityFilters/'+Id
        }
        var request = {
            url : url,
            method : 'GET',
            headers : {
                Authorization: 'Bearer '+ Ext.util.Cookies.get('token')
            },
            success : function(response,options){
                var data = Ext.decode(response.responseText).data;
                Ext.create('CGP.cmspublishgoals.view.options.ManagerQueryOrFilter',{
                    title: i18n.getKey('manager')+i18n.getKey(title),
                    data: data,
                    controller: me,
                    type: type
                }).show();
            },
            failure : function(response,options){
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure') + object.data.message);
            }
        };
        if(Ext.isEmpty(Id)){
            Ext.Msg.confirm(i18n.getKey('prompt'),'没有'+title+',检查此cmspublishgoal?',callback);
            function callback(id){
                if(id === 'yes'){
                    JSOpen({
                        id : "cmspublishgoals_edit",
                        url :  path + "partials/cmspublishgoals/edit.html?id=" + cmsPublishGoalId,
                        title: i18n.getKey('edit') +"_"+ i18n.getKey('cmspublishgoals'),
                        refresh: true
                    })
                }
            }
        }else{
            Ext.Ajax.request(request);
        }
    },
    saveQueryOrFilter: function(data,win,type){
        var url;
        if(type == 'query'){
            url = adminPath + 'api/cmsEntityQuery/'+data.id;
        }else if(type == 'filter'){
            url = adminPath + 'api/cmsEntityFilters/'+data.id
        }
        Ext.Ajax.request({
            url : url,
            method : 'PUT',
            jsonData: data,
            headers : {
                Authorization: 'Bearer '+ Ext.util.Cookies.get('token')
            },
            success : function(response,options){
                var resp = Ext.JSON.decode(response.responseText);
                if(resp.success){
                    Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('savesuccess'));
                    win.close();
                }else{
                    Ext.Msg.alert(i18n.getKey('requestFailed'),resp.data.message);
                }
            },
            failure : function(response,options){
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure') + object.data.message);
            }
        })
    },
    publish: function(cmspublishgoalId,jenkinsTaskUrl){
        Ext.Msg.confirm(i18n.getKey('prompt'),'确认发布？',callback);
        function callback(id){
            if(id === 'yes'){
                Ext.Ajax.request({
                    url : adminPath + 'api/cmsPublishGoals/'+cmspublishgoalId+'/publish',
                    method : 'POST',
                    headers : {
                        Authorization: 'Bearer '+ Ext.util.Cookies.get('token')
                    },
                    jsonData: {},
                    success : function(response,options){
                        var resp = Ext.JSON.decode(response.responseText);
                        if(resp.success){
                            window.open(jenkinsTaskUrl);
                        }else{
                            Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('publish')+i18n.getKey('failure')+':'+resp.data.message);
                        }
                    },
                    failure : function(response,options){
                        var object = Ext.JSON.decode(response.responseText);
                        Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure') + object.data.message);
                    }
                })
            }
        }
    }
});