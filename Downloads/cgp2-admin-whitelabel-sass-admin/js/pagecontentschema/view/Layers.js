/**
 * Created by nan on 2020/8/24.
 */
Ext.Loader.syncRequire([
    'CGP.pagecontentschema.view.LayerLeftTreePanel',
    'CGP.pagecontentschema.view.LayerCenterPanel'
])
Ext.define("CGP.pagecontentschema.view.Layers", {
    extend: 'Ext.panel.Panel',
    alias: 'widget.layers',
    layout: 'border',
    border: false,
    title: i18n.getKey('layers'),
    LayerLeftTreePanelConfig: null,
    setValue: function (data) {
        var me = this;
        var leftTreePanel = me.getComponent('leftTreePanel');
        leftTreePanel.setValue(data);
    },
    getValue: function () {
        var me = this;
        var leftTreePanel = me.getComponent('leftTreePanel');
        var centerPanel = me.getComponent('centerPanel');
        if (centerPanel.rendered == true && centerPanel.items.items.length > 0) {
            var value = centerPanel.getValue();
            var recordId = centerPanel.data._id;
            centerPanel.record = leftTreePanel.getRootNode().findChild('_id', recordId, true);//实时取得最新的record,treepanel，每次刷新时都说加载新的record
            centerPanel.record.set('data', value);
            centerPanel.record.raw = value;
        }
        var result = leftTreePanel.getValue();
        console.log(result);
        return result;
    },
    isValid: function () {
        return true;
    },
    initComponent: function () {
        var me = this;
        me.items = [
            Ext.Object.merge({
                xtype: 'layerlefttreepanel',
                itemId: 'leftTreePanel',
            }, me.LayerLeftTreePanelConfig),
            {
                xtype: 'layercenterpanel',
                itemId: 'centerPanel',
            }
        ];
        me.callParent(arguments);
    }
});

