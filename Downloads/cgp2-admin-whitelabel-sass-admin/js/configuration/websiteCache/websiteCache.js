Ext.onReady(function(){



    var description = {
        paymentModuleConfigs : '储存在后台服务器中的关于付款方式的配置数据。',
        configurations : "储存后台服务器中的网站的配置数据。",
        shippingModuleConfigs : "储存在后台服务器中的关于运输方式的配置数据。",
        impactSvg:'DynamicSize服務獲取ImpactSvg的緩存'
    };
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    };

    var CacheNames = null;
    Ext.Ajax.request({
        url : adminPath + 'api/cache/'+getQueryString('websiteId'),
        method : 'GET',
        headers: {Authorization: 'Bearer '+Ext.util.Cookies.get('token')},
        success : function(resp){
            var response = Ext.JSON.decode(resp.responseText);
            if(response.success){
                if(!Ext.isEmpty(response.data))
                    CacheNames = response.data.cacheNames;
                addToWindow(CacheNames);
            }else{
                Ext.Msg.alert(i18n.getKey('requestFailed'),response.data.message);
            }
        },
        failure : function(resp){
            var response = Ext.JSON.decode(resp.responseText);
            Ext.Msg.alert(i18n.getKey('requestFailed'),response.data.message);
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
            title : i18n.getKey('websitecache'),
            items : []
        }]
    });

    function addToWindow(cacheNames){
        for(var i= 0; i < cacheNames.length;i++){
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
            page.child('panel').add(container);
        }
    }

    function clearCache(button){
        var value = button.itemId;

        Ext.Ajax.request({
            url : adminPath + 'api/cache/websiteCache',
            method : 'DELETE',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: {
                websiteId: getQueryString('websiteId'),
                cacheName: value
            },
            success : function(resp){
                var response = Ext.JSON.decode(resp.responseText);
                if(response.success){
                    var prompt = button.ownerCt.getComponent("prompt");
                    prompt.show();
                }else{
                    Ext.Msg.alert(i18n.getKey('requestFailed'),response.data.message);
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