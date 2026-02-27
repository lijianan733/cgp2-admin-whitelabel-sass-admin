Ext.define("CGP.cmspublish.controller.EditController",{
    cmspublishWindow : null, //某属性下的选项列表
    page : null, //属性的编辑页面

    constructor : function(config){
        var me = this;

        me.callParent(arguments);
    },
    openOptionWindow : function( page,record){
        var me = this,isEdit = record;
        me.page = page;
        if(Ext.isEmpty(record)){
            record = Ext.create('CGP.cmspublish.model.CmsPublishTask',{
                id: null,
                command: "",
                type: "",
                sortOrder: "",
                description: ""
            });
        }
        if(Ext.isEmpty(me.cmspublishWindow)){
            me.cmspublishWindow =  Ext.create("CGP.cmspublish.view.AddPublishTask",{
                record : record,
                controller : me,
                btnFunction : me.save
            });
        }else{
            me.cmspublishWindow.reset(record);
        }
        if(Ext.isEmpty(isEdit)){
            me.cmspublishWindow.setTitle(i18n.getKey('create'));
        }else{
            me.cmspublishWindow.setTitle(i18n.getKey('edit'));
        }
        me.cmspublishWindow.show();
    },
    save : function (record,type,command,sortOrder,description){
        var me = this;
        var sotre = me.page.form.getComponent("tasks").getStore();
        record.set("command",command);
        record.set("sortOrder",sortOrder);
        record.set("description",description);
        record.set("type",type);
        if(record.get("id") <= 0 ){
            sotre.insert(1,record);
        }
        sotre.sort("sortOrder", "ASC");
        me.cmspublishWindow.close();
    }
});