/**
 *详细页
 **/
Ext.define('CGP.threedpreviewplan.view.preview.PreviewMain', {
    extend: 'Ext.Viewport',


    layout: 'border',

    initComponent: function () {

        var me = this;
        var modelInfo = Ext.create('CGP.threedpreviewplan.view.preview.ModelInfo',{
            preview: true,
            itemId: 'modelInfo',
            width: 460,
            region: 'west'
        });
        var previewPanel = Ext.create('CGP.threedpreviewplan.view.preview.PreviewPanel',{
            preview: true,
            itemId: 'previewPanel',
            region: 'center'
        });
        me.items = [modelInfo,previewPanel];
        me.callParent(arguments);
        me.form = me.down('form');

    },
    getValue: function () {
        var me = this;
        var result = {};
        var modelInfo = me.getComponent('modelInfo');
        result = modelInfo.getValue();
        return result;
    },
    setValue: function (){

    }


});
