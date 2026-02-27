/**
 * Created by shirley on 2021/07/15
 */
Ext.Loader.syncRequire(['CGP.pcspreprocesscommonsource.view.MarginOrPaddingFieldContainer']);
Ext.define('CGP.pcspreprocesscommonsource.view.FlowGridSourceForm', {
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
                allowBlank: false,
                itemId: 'clazz',
                value: 'com.qpp.cgp.domain.pcspreprocess.source.FlowGridSourceConfig'
            },
            {
                name: 'margin',
                itemId: 'margin',
                width: 372,
                xtype: 'marginorpaddingfieldcontainer',
                fieldLabel:'margin',
                tipInfo:'最外层容器外间距'
            },
            {
                name: 'parding',
                itemId: 'parding',
                width: 372,
                xtype: 'marginorpaddingfieldcontainer',
                fieldLabel: 'parding',
                tipInfo:'单个定制区域外间距'
            },
            {
                name: 'itemQty',
                itemId: 'itemQty',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('itemQty'),
                minValue: 0,
                allowDecimals: false
            },
            {
                name: 'horizontalOrVertical',
                itemId: 'horizontalOrVertical',
                fieldLabel: i18n.getKey('horizontalOrVertical'),
                xtype: 'radiogroup',
                columns: 2,
                vertical: true,
                items: [
                    {boxLabel:i18n.getKey('horizontal'), name: 'horizontalOrVertical', inputValue: true, checked: true},
                    {boxLabel: i18n.getKey('verticality'), name: 'horizontalOrVertical', inputValue: false},
                ],
                allowBlank: false
            },
            {
                name: 'max',
                itemId: 'max',
                width: 372,
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('maxValue'),
                minValue: 0,
                allowBlank: false,
                allowDecimals: false,
                tipInfo: '水平或垂直方向能显示的最大数量。'
            }
        ];
        me.callParent();
    }
})