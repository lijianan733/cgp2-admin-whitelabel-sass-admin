/**
 * Created by admin on 2021/01/14
 */
Ext.Loader.syncRequire(["CGP.tools.freemark.template.model.FreemarkTemplate"]);
Ext.define("CGP.tools.freemark.template.Edit", {
    extend: "Ext.tab.Panel",
    require:[
        "CGP.tools.freemark.template.model.FreemarkTemplate",
        "CGP.tools.freemark.template.view.Information"
    ],
    region: 'center',
    header: false,
    createOrEdit: 'create',
    initComponent: function () {
        var me = this;
        me.data = {};
        var urlParams = Ext.Object.fromQueryString(location.search);
        me.editModel = Ext.ModelManager.getModel("CGP.tools.freemark.template.model.FreemarkTemplate");
        me.createOrEdit = urlParams.id ? 'edit' : 'create';
        me.itemId = 'freemarkTemplate';
        me.title = i18n.getKey("freemarkTemplate");

        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [
                {
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function (comp) {
                        me.submitData();
                    }
                }
            ]
        });

        var Information = Ext.create('CGP.tools.freemark.template.view.Information', {
            itemId:'information',
            editModel: me.editModel
        });
        me.items = [
            Information,
            Ext.create('CGP.tools.freemark.template.view.TestTab',{
                itemId:'testTab',
                title:i18n.getKey('test')+i18n.getKey('form'),
            })
        ];
        me.callParent(arguments);
        if (!Ext.isEmpty(urlParams.id)) {
            me.editModel.load(Number(urlParams.id), {
                success: function (record, operation) {
                    me.editModel.data = record.data;
                    me.refreshData(record.data);
                }
            });
        }
        else{
            me.editModel.data ={"clazz" : "com.qpp.composing.domain.freemarker.DefineVariableTemplate"};
        }
    },

    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        items[0].refreshData(data);
    },
    submitData:function(){
        var me = this;
        var items = me.items.items, isValid = true;
        var controller = Ext.create('CGP.tools.freemark.template.controller.Controller');
        var item=items[0];
            if (isValid&&!item.isValid())
                isValid = false;
        me.editModel.data=Ext.Object.merge(me.editModel.data,item.getValue());
        if (isValid) {
            if (me.createOrEdit == 'create') {
                delete me.editModel.data._id;
            }
            var mask = me.setLoading();
            controller.saveData(me.editModel.data, me, mask);
        }
    }
});