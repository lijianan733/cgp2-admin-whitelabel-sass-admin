Ext.onReady(function(){



    var description = {
        i18nInformations : '储存在后台服务器中的多语言数据,客户端根据这些数据将网站中的文字翻译成其他语言。',
        navigators: '后台导航栏缓存',
        configurations: '后台网站配置缓存'
    };

    var CacheNames = null;
    Ext.Ajax.request({
        url : adminPath + 'api/cache/5' ,
        method : 'GET',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        success : function(resp){
            var response = Ext.JSON.decode(resp.responseText);
            if(response.success){
                if(!Ext.isEmpty(response.data))
                    CacheNames = response.data.cacheNames;
                    addToWindow(CacheNames);
            }else{
                Ext.Msg.alert(i18n.getKey('prompt'),response.data.message);
            }
        },
        failure : function(resp){
            var response = Ext.JSON.decode(resp.responseText);
            Ext.Msg.alert(i18n.getKey('prompt'),response.data.message);
        }
    });


    var page = Ext.create("Ext.container.Viewport",{
        renderTo: Ext.getBody(),
        autoScroll: true,
        layout: 'border',
        items : [{
            xtype : 'panel',
            region: 'center',
            height : '100%',
            width : "100%",
            title : i18n.getKey('systemcache'),
            items : []
        }]
    });

    function addToWindow(cacheNames){
        for(var i= 0; i < cacheNames.length;i++){
            if(i == 1){

            }else{
                var container = Ext.create("Ext.container.Container",{
                    //height : 40,
                    width : 700,
                    itemId:"Container" + i,
                    layout:'column',
                    style : {
                        //"text-align" : 'right'
                        marginTop : '10px',
                        marginLeft : '20px'
                    },

                    items : [{
                        xtype : "displayfield",
                        width : 500,
                        fieldLabel : i18n.getKey(cacheNames[i]),
                        value : "<font color='gray'>"+description[cacheNames[i]]+"</font>"
                    },{
                        xtype : 'button',
                        itemId : cacheNames[i],
                        width : 100,
                        frame : true,
                        text : i18n.getKey('clearCache'),
                        style  : {
                            //'text-align':'right',
                            marginLeft : '50px'
                        },
                        handler : function(button){
                            clearCache(button);
                        }
                    },{
                        xtype : 'displayfield',
                        itemId : 'prompt',
                        style : {
                            marginLeft : '10px'
                        },
                        value : '<font color="#008000">'+i18n.getKey('success')+'</font>',
                        hidden : true
                    }]
                });
            }
            page.child('panel').add(container);
            //Ext.getComponent('container3').hide();
        }
    }

    function clearCache(button){
        Ext.Ajax.request({
            url : adminPath + 'api/cache/websiteCache',
            method : 'DELETE',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: {
                websiteId: 5,
                cacheName: button.itemId
            },
            success : function(resp){
                if(button.itemId == 'i18nInformations'){
                    Ext.Ajax.request({
                        url: adminPath + 'api/cache/websiteCache',
                        method: 'DELETE',
                        headers: {
                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                        },
                        jsonData: {
                            websiteId: 5,
                            cacheName: 'resources'
                        },
                        success : function(response){
                            var resp = Ext.JSON.decode(response.responseText);
                            if(resp.success){
                                var prompt = button.ownerCt.getComponent("prompt");
                                prompt.show();
                            }
                        }
                    })

                }else{
                    var response = Ext.JSON.decode(resp.responseText);
                    if(response.success){
                        var prompt = button.ownerCt.getComponent("prompt");
                        prompt.show();
                    }
                }
            },
            failure : function(resp){
                var response = Ext.JSON.decode(resp.responseText);
                var prompt = button.ownerCt.getComponent("prompt");
                prompt.setValue("<div>"+i18n.getKey('failure ')+":"+response.data.message+"</div>");
                prompt.show();
            }
        });
    }


});