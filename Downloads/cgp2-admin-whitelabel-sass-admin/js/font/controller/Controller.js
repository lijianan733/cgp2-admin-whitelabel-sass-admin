Ext.define("CGP.font.controller.Controller",{



    optionWindow : null,//属性的选项管理window（显示）
    addOptionWindow : null,//添加一个选项的添加window（添加）

    constructor : function(config){
        var me = this;

        me.callParent(arguments);
    },

    openOptionWindow : function(record){
        var me = this;

        if (Ext.isEmpty(me.optionWindow)){
            me.optionWindow = Ext.create("CGP.attribute.view.window.Option",{
                attributeId : record.get("id"),
                controller : me
            });
        }else{
            me.optionWindow.refresh(record.get("id"));
        }
        me.optionWindow.setTitle(i18n.getKey('attribute')+": "+record.get("name"));
        me.optionWindow.show();
    },
    openLanguageWindow: function(store,filterData){
        var me = this;
        Ext.create("CGP.font.view.AddLanguageWindow",{
            store : store,
            controller : me,
            filterData: filterData
        }).show();
    },

    openAddOptionWindow : function(record){
        var me = this;
        if(Ext.isEmpty(record)){
            record = Ext.create('CGP.attribute.model.AttributeOption',{
                id: null,
                name: "",
                sortOrder: "",
                imageUrl: "",
                displayValue: "",
                value: ""
            });
        }
        if(!me.addOptionWindow){
            me.addOptionWindow = Ext.create("CGP.attribute.view.window.AddOption",{
                record : record,
                controller : me,
                btnFunction : me.addOption
            });
        }else{
            me.addOptionWindow.reset(record);
        }
        me.addOptionWindow.show();
    },

    /**
     * 将一个新建的选项加入到一个属性的 选项集合Store 中
     * 这个Store是自动同步的。
     */
    addLanguage : function(records,win,store) {
        var me = this;
        var data = [];
        Ext.each(records,function (item) {
            data.push(item.data);
        });
        store.add(data);
        win.close();
    },
    deleteRecords: function (recordId,grid) {
        Ext.Ajax.request({
            url: adminPath + 'api/builderConfigs/deleteFont/' + recordId,
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'), function () {
                        grid.store.load();
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        })
    }
});