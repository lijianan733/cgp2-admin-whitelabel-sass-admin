/**
 * Created by nan on 2020/12/18
 */
Ext.define('CGP.background.view.MainPanel', {
    extend: 'Ext.panel.Panel',
    controller: null,
    layout: {
        type: 'border'
    },
    initComponent: function () {
        var me = this;
        console.log('asdf')
        me.controller = Ext.create('CGP.background.controller.Controller');
        var leftGridPanel = Ext.create('CGP.background.view.LeftGridPanel', {
            region: 'west',
            itemId: 'leftGridPanel',
            split: true,
            readOnly: false,
        });
        var centerGridPanel = Ext.create('CGP.background.view.CenterGridPanel', {
            itemId: 'centerPanel',
            header: false,
            region: 'center',
            style: {
                backgroundColor: 'white',
            }
        });
        me.items = [leftGridPanel, centerGridPanel];
        me.callParent();
    }
})