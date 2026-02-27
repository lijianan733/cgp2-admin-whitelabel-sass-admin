/**
 * Created by shirley on 2021/07/13
 * GridSourceConfig类型source配置表单（新增/修改）
 */
Ext.Loader.syncRequire(['CGP.pcspreprocesscommonsource.view.MarginOrPaddingFieldContainer']);
Ext.define('CGP.pcspreprocesscommonsource.view.GridSourceForm', {
    extend: 'CGP.pcspreprocesscommonsource.view.SubEditForm',
    designId: '',
    defaults: {
        padding: '10 25 5 25',
        width: 350,
        labelAlign: 'left',
        labelWidth: 120
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                name: 'clazz',
                xtype: 'textfield',
                hidden: true,
                itemId: 'clazz',
                value: 'com.qpp.cgp.domain.pcspreprocess.source.GridSourceConfig'
            },
            {
                name: 'margin',
                itemId: 'margin',
                width:372,
                xtype: 'marginorpaddingfieldcontainer',
                fieldLabel: 'margin',
                tipInfo:'最外层容器外间距'
            },
            {
                name: 'parding',
                itemId: 'parding',
                width:372,
                xtype: 'marginorpaddingfieldcontainer',
                fieldLabel: 'parding',
                tipInfo:'单个定制区域外间距'
            },
            {
                name: 'itemQty',
                itemId: 'itemQty',
                xtype: 'numberfield',
                allowBlank: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('itemQty'),
                minValue: 0,
                width:372,
                validator: function (data) {
                    var me = this;
                    var row = me.ownerCt.getComponent('row').getValue() || 0;
                    var column = me.ownerCt.getComponent('column').getValue() || 0;
                    if (data >= row * column) {
                        return true;
                    } else {
                        return i18n.getKey('ItemQty必须大于或等于row和column的乘积。');
                    }
                },
                tipInfo:'ItemQty必须大于或等于<br>row和column的乘积。'
            },
            {
                name: 'row',
                itemId: 'row',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('row'),
                minValue: 0,
                width:372,
                allowBlank: false,
                allowDecimals: false,
                tipInfo:'横向最大显示数量'
            },
            {
                name: 'column',
                itemId: 'column',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('column'),
                minValue: 0,
                width:372,
                allowBlank: false,
                allowDecimals: false,
                tipInfo:'纵向最大显示数量'
            }
        ];
        me.callParent();
    }
})