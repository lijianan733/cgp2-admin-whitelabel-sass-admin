/**
 * Created by admin on 2019/4/10.
 */
Ext.Loader.syncRequire(["CGP.dsdatasource.model.DsdataSource", "CGP.dsdatasource.view.editJson"]);
Ext.define("CGP.dsdatasource.editTab", {
    extend: "Ext.tab.Panel",
    region: 'center',
    header: false,

    initComponent: function () {
        var me = this;
        me.data = {};
        var urlParams = Ext.Object.fromQueryString(location.search);
        var dataSourceModel = null;
        if (urlParams.id != null) {
            dataSourceModel = Ext.ModelManager.getModel("CGP.dsdatasource.model.DsdataSource");
        }
        var createOrEdit = urlParams.id ? 'edit' : 'create';
        me.itemId = 'dsdatasource';
        me.title = i18n.getKey("dsdatasource");
        var controller = Ext.create('CGP.dsdatasource.controller.Controller');
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
                        if (createOrEdit == 'create') {
                            delete me.data._id;
                        }
                        var mask = me.setLoading();
                        var saveData = [];
                        saveData.push(me.data);
                        controller.addPageTemplateConfigWin(saveData, dataSourceModel, mask);
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
                        dataSourceModel = null;
//					urlParams.id = null;
                        this.setDisabled(true);
                        //window.parent.Ext.getCmp("dsdatasource").setTitle(i18n.getKey('create') + "_" + i18n.getKey('dsdatasource'));
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
                        me.showJsonData(dataSourceModel, createOrEdit)

                    }
                }
            ]
        });

        var Information = Ext.create('CGP.dsdatasource.view.Information', {
            dataSourceModel: dataSourceModel
        });
        me.items = [
            Information
        ];
        me.callParent(arguments);
        if (!Ext.isEmpty(urlParams.id)) {
            dataSourceModel.load(Number(urlParams.id), {
                success: function (record, operation) {
                    dataSourceModel = record;
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
    showJsonData: function (dataSourceModel, createOrEdit) {
        Ext.create('CGP.dsdatasource.view.editJson', {
            dataSourceModel: dataSourceModel,
            createOrEdit: createOrEdit
        });
    }
});