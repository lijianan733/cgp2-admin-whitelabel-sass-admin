/**
 * Created by admin on 2019/4/10.
 */
Ext.Loader.syncRequire(["CGP.dsrequesttemplate.model.RequestTemplate","CGP.dsrequesttemplate.view.editJson"]);
Ext.define("CGP.dsrequesttemplate.editTab", {
    extend: "Ext.tab.Panel",
    region: 'center',
    header: false,

    initComponent: function () {
        var me = this;
        me.data = {};
        var urlParams = Ext.Object.fromQueryString(location.search);
        var requestTemplateModel = null;
        if (urlParams.id != null) {
            requestTemplateModel = Ext.ModelManager.getModel("CGP.dsrequesttemplate.model.RequestTemplate");
        }
        var createOrEdit = urlParams.id ? 'edit' : 'create';
        me.itemId='dsrequesttemplate';
        me.title = i18n.getKey("dsrequesttemplate");
        var controller = Ext.create('CGP.dsrequesttemplate.controller.Controller');
        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [
                {
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function (comp) {
                        var items = me.items.items;
                        Ext.Array.each(items, function (item) {
                                Ext.Object.merge(me.data, item.getValue());
                        });
                        if(createOrEdit == 'create'){
                            delete me.data._id;
                        }
                        var mask = me.setLoading();
                        var saveData=[];
                        saveData.push(me.data);
                        controller.addPageTemplateConfigWin(saveData, requestTemplateModel, mask);
                    }
                },
                /*{
                 itemId: 'reset',
                 text: i18n.getKey('reset'),
                 iconCls: 'icon_reset',
                 handler: function(){
                 Ext.Msg.confirm('提示', '是否恢复成上次保存的数据？', callback);
                 function callback(id){
                 if(id === 'yes'){
                 me.refreshData(me.data)
                 }
                 }
                 }
                 },*/
                {
                    xtype: 'button',
                    itemId: "copy",
                    text: i18n.getKey('copy'),
                    iconCls: 'icon_copy',
                    disabled: urlParams.id == null,
                    handler: function () {
                        requestTemplateModel = null;
//					urlParams.id = null;
                        this.setDisabled(true);
                        //window.parent.Ext.getCmp("dsrequesttemplate").setTitle(i18n.getKey('create') + "_" + i18n.getKey('dsrequesttemplate'));
                        var idComp = me.getComponent('information').getComponent('id');
                        idComp.setValue("");
                        idComp.setVisible(false);
                        createOrEdit = 'create';
                    }
                },
                {
                    xtype: 'button',
                    itemId: "checkJson",
                    //disabled: urlParams.id == null,
                    text: i18n.getKey('check') + i18n.getKey('JSON'),
                    iconCls: 'icon_check',
                    handler: function () {
                        me.showJsonData(requestTemplateModel,createOrEdit)

                    }
                }
            ]
        });

        var Information=Ext.create('CGP.dsrequesttemplate.view.Information',{
            requestTemplateModel: requestTemplateModel
        });
        me.items = [
            Information
        ];
        me.callParent(arguments);
        if (!Ext.isEmpty(urlParams.id)) {
            requestTemplateModel.load(Number(urlParams.id), {
                success: function (record, operation) {
                    requestTemplateModel = record;
                    me.refreshData(record.data);
                }
            });
        } else {
            //me.refreshData(data);
        }
    },
    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        me.data = data;
        Ext.Array.each(items, function (item) {
            item.refreshData(data);
        })
    },
    showJsonData: function (requestTemplateModel,createOrEdit) {
        Ext.create('CGP.dsrequesttemplate.view.editJson',{
            requestTemplateModel: requestTemplateModel,
            createOrEdit: createOrEdit
        });
    }
});