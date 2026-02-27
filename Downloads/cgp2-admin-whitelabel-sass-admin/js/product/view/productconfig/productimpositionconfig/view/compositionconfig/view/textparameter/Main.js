/**
 * Created by miao on 2021/6/09.
 */
Ext.onReady(function () {
    var me = this;
    var impositionId = parseInt(JSGetQueryString('impositionId'));
    var store = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.store.TextParameter', {
        params: {
            filter: '[{"name":"productConfigImpositionId","value":' + impositionId + ',"type":"number"}]'
        }
    });
    var controller = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.controller.Controller');
    // var tabPanel=me.ownerCt;
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('textParamete'),
        block: 'textParamete',
        // 编辑页面
        editPage: 'edit.html',
        height: '100%',
        tbarCfg: {
            btnCreate: {
                handler: function () {
                    controller.editTextParameter(me, i18n.getKey('textParameter') + i18n.getKey('create'));
                }
            },
        },
        listeners: {},
        gridCfg: {
            // store是指store.js
            store: store,
            frame: false,
            multiSelect: false,
            selType: 'checkboxmodel',
            selModel: Ext.create("Ext.selection.CheckboxModel", {
                injectCheckbox: 0,//checkbox位于哪一列，默认值为0
                mode: "multi",//multi,simple,single；默认为多选multi
                checkOnly: false,//如果值为true，则只用点击checkbox列才能选中此条记录
                allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
                enableKeyNav: true,//开启/关闭在网格内的键盘导航。
                showHeaderCheckbox: false,//如果此项为false在复选框列头将不显示.,
                hideHeaders: true
            }),
            editActionHandler: function (gridView, rowIndex, colIndex, a, b, record) {
                var grid = gridView.ownerCt;
                var tab = grid.ownerCt;
                var recordData = record.raw;
                controller.editTextParameter(me, i18n.getKey('textParameter') + i18n.getKey('edit'), recordData._id);
            },
            bodyStyle: 'overflow-x:hidden;',
            columnWidth: 150,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: 'id',
                    sortable: true,
                    width: 100
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    renderer: function (value, metaData, record) {
                        return value;
                    }
                },
                {
                    text: i18n.getKey('value') + i18n.getKey('template'),
                    dataIndex: 'valueTemplate',
                    flex: 1,
                    renderer: function (value, metaData, record) {
                        metaData.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
            ]
        },
        filterCfg: {
            // header: false,
            defaults: {
                isLike: false
            },
            header:false,
            items:
                [
                    {
                        name: '_id',
                        xtype: 'textfield',
                        hideTrigger: true,
                        fieldLabel: i18n.getKey('id'),
                        itemId: 'id'
                    },
                    {
                        name: "name",
                        xtype: "textfield",
                        fieldLabel: i18n.getKey('name'),
                        itemId: 'name'
                    },
                    {
                        name: "productConfigImpositionId",
                        xtype: "numberfield",
                        fieldLabel: i18n.getKey('productConfigImpositionId'),
                        itemId: 'productConfigImpositionId',
                        value:impositionId,
                        hidden:true
                    },
                ]
        }
    });
})