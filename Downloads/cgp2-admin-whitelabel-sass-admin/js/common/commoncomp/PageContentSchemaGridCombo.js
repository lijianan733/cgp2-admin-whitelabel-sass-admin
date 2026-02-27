/**
 * @Description:
 * @author nan
 * @date 2023/11/22
 */
Ext.Loader.syncRequire([
    'CGP.common.controller.Controller',
    'CGP.materialviewtype.store.PageContentSchema'
])
Ext.define('CGP.common.commoncomp.PageContentSchemaGridCombo', {
    extend: 'Ext.ux.form.SingleGridComBox',
    alias: 'widget.pcs_gridcombo',
    fieldLabel: i18n.getKey('pageContent Schema'),
    displayField: 'name',
    valueField: '_id',
    editable: false,
    matchFieldWidth: false,
    multiSelect: false,
    autoScroll: true,
    filterCfg: {
        height: 65,
        layout: {
            type: 'column',
            columns: 2
        },
        fieldDefaults: {
            labelAlign: 'right',
            layout: 'anchor',
            width: 200,
            style: 'margin-right:20px; margin-top : 5px;',
            labelWidth: 50
        },
        items: [
            {
                name: '_id',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            },
            {
                name: 'name',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }
        ]
    },
    gotoConfigHandler: function () {
        var me = this;
        var pcsId = me.getSingleValue();
        var controller = Ext.create('CGP.common.controller.Controller');
        //根据内容跳到v2还是v3
        controller.checkPCSConfig(pcsId);
    },
    diySetValue: function (data) {
        var me = this;
        me.setInitialValue([data]);
    },
    diyGetValue: function () {
        var me = this;
        return me.getSingleValue();
    },
    initComponent: function () {
        var me = this;
        var pageContentSchemaStore = Ext.create('CGP.materialviewtype.store.PageContentSchema');
        me.store = pageContentSchemaStore;
        me.gridCfg = {
            store: pageContentSchemaStore,
            height: 300,
            width: 450,
            viewConfig: {
                enableTextSelection: true
            },
            autoScroll: true,
            columns: [
                {
                    text: i18n.getKey('id'),
                    width: 80,
                    dataIndex: '_id',
                    renderer: function (value, metaData) {
                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('name'),
                    flex: 1,
                    dataIndex: 'name',
                    renderer: function (value, metaData, record, rowIndex) {
                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                        return value
                    }
                },
                {
                    text: i18n.getKey('版本'),
                    width: 60,
                    dataIndex: 'structVersion',
                    renderer: function (value, metaData, record) {
                        if (value == 3) {
                            return 'V3'
                        } else if (value == 2) {
                            return 'V2'
                        }
                    }
                }
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: pageContentSchemaStore,
            }
        };
        me.callParent();
    }
})