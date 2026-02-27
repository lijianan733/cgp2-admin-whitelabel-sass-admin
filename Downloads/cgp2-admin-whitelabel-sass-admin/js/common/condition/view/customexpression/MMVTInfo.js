/**
 * @Description:mmvt的上下文结构模板
 * @author nan
 * @date 2024/3/12
 */
Ext.Loader.syncRequire([
    'CGP.materialmvt.config.Config',
    'Ext.ux.tree.JsonDataPanel'
]);
Ext.define('CGP.common.condition.view.customexpression.MMVTInfo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mmvt_info',
    closable: true,
    flex: 1,
    layout: {
        type: 'fit'
    },
    header: false,
    autoScroll: true,
    collapsible: true,
    initComponent: function () {
        var me = this;
        var data = CGP.materialmvt.config.Config.mmvtContextData;
        me.items = [{
            xtype: 'json_data_panel',
            title: 'MMVT上下文结构示例数据',
            header: false,
            rawData: data,
            width: 600,
            height: 600,
        }];
        me.callParent();
    }
})