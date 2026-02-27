Ext.define("CGP.threedpreviewplan.view.ModelVariableForm", {
    extend: "Ext.tab.Panel",
    header: false,
    layout: 'fit',
    preview: false,
    defaults: {
        width: 850,
        height: 200
    },
    initComponent: function () {
        var me = this;
        me.data = {};
        //me.title = i18n.getKey("materialInfo");
        var controller = Ext.create('CGP.materialviewtype.controller.Controller');
        var cameraForm = Ext.create('CGP.threedpreviewplan.view.CameraVariableForm',{
            itemId: 'camera'
        });
        var navigationConfigForm = Ext.create('CGP.threedpreviewplan.view.NavigationConfigForm',{
            itemId: 'navigationConfig'
        });
        var threeDModelDataForm = Ext.create('CGP.threedpreviewplan.view.ThreeDModelDataForm',{
            hidden: me.preview,
            itemId: 'threeDModelData'
        });

        me.items = [
            cameraForm ,navigationConfigForm,threeDModelDataForm
        ];
        me.callParent(arguments);

    },
    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        me.data = data;
        Ext.Array.each(items, function (item) {
            item.refreshData(data);
        })
    },
    getValue: function (){
        var me = this;
        var camera = me.getComponent('camera').getValue();
        var navigation = me.getComponent('navigationConfig').getValue();
        var threeDModelData = me.getComponent('threeDModelData').getValue();
        var result = {
            threeDModel: threeDModelData,
            views: navigation
        };
        result = Ext.Object.merge(result,camera);
        return result;
    },
    setValue: function (data){
        var me = this;
        var camera = me.getComponent('camera');
        camera.setValue(data);
        var navigation = me.getComponent('navigationConfig');
        navigation.setValue(data.views);
        navigation.data = data.views;
        var threeDModelData = me.getComponent('threeDModelData');
        threeDModelData.setValue(data.threeDModel);
    }
});
