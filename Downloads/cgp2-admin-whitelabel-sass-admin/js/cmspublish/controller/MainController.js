Ext.define("CGP.cmspublish.controller.MainController",{



    cmspublishWindow : null,//属性的选项管理window（显示）
    addOptionWindow : null,//添加一个选项的添加window（添加）

    constructor : function(config){
        var me = this;

        me.callParent(arguments);
    },

    openOptionWindow : function(record){
        var me = this;

            me.cmspublishWindow = Ext.create("CGP.cmspublish.view.PublishTask",{
                cmspublishId : record.get("id"),
                controller : me
            });
            //me.cmspublishWindow.refresh(record.get("id"));
        me.cmspublishWindow.setTitle(i18n.getKey('publishTasks')+": "+record.get("name"));
        me.cmspublishWindow.show();
    },

    openAddOptionWindow : function(record){
        var me = this;
        if(Ext.isEmpty(record)){
            record = Ext.create('CGP.cmspublish.model.CmsPublishTask',{
                id: null,
                command: "",
                sortOrder: "",
                description: "",
                type:""
            });
        }
        if(!me.addcmspublishWindow){
            me.addcmspublishWindow = Ext.create("CGP.cmspublish.view.AddPublishTask",{
                record : record,
                controller : me,
                btnFunction : me.addOption
            });
        }else{
            me.addcmspublishWindow.reset(record);
        }
        me.addcmspublishWindow.show();
    },

    /**
     * 将一个新建的选项加入到一个属性的 选项集合Store 中
     * 这个Store是自动同步的。
     */
    addOption : function(record,type,command,sortOrder,description) {
        var me = this;
        var store = me.cmspublishWindow.grid.getStore();
        if(Ext.isEmpty(record.get("id"))){
            var r = Ext.create("CGP.cmspublish.model.CmsPublishTask",{
                id: null,
                command: command,
                type:type,
                sortOrder: sortOrder,
                description: description || ""
            });
            store.insert(1,r);
        }else{
            record.set("command",command);
            record.set("type",type);
            record.set("sortOrder",sortOrder);
            record.set("description",description);
        }
    }
});