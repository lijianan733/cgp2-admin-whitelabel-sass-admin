/**
 * @author nan
 * @date 2026/1/26
 * @description TODO
 */

Ext.define('CGP.partner_bill.controller.Controller', {

    showConfigHelp: function () {
        var str = '规则1 下单后,账单会同步生成<br>';
        var win = Ext.create('Ext.window.Window', {
            title: '配置相关说明',
            width: 650,
            height: 250,
            modal: true,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'component',
                    width: 600,
                    html: `<div style="text-align: center;"><font style="font-weight: bold;font-size: 16px">${str}</font><div>`
                }
            ]
        });
        win.show();

    }

})