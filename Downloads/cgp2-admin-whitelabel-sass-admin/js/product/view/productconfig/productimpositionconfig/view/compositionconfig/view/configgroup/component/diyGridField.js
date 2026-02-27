Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.configgroup.component.diyGridField', {
    extend: 'Ext.ux.form.field.GridFieldExtendContainer',
    alias: 'widget.diygridfield',
    deleteHandler: null,//删除的具体操作
    addHandler: null,//添加按钮的操作
    dataWindowCfg: null,//弹窗的配置
    searchGridCfg: null,//弹窗的中SearchGrid的配置,参照CGP.common.commoncomp.QueryGrid,若不配置
    initComponent: function () {
        var me = this;
        me.searchGridCfg.gridCfg.columns = [
            {
                text: i18n.getKey('id'),
                dataIndex: 'id',
                renderer: function (value, metaData, record, rowIndex) {
                    if (record.get('clazz') != 'com.qpp.cgp.composing.config.JobGenerateConfig') {
                        return '';
                    } else {
                        return value;
                    }
                }
            },
            {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                width: 250,
            },
            {
                text: i18n.getKey('Job配置编号'),
                dataIndex: 'jobConfig',
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    if (value) {
                        return value._id;
                    }
                }
            },
            {
                text: i18n.getKey('job配置名称'),
                dataIndex: 'jobConfig',
                width: 200,
                renderer: function (value, medate, record) {
                    if (value) {
                        return value.name;
                    }
                }
            },
            {
                text: i18n.getKey('jobType'),
                dataIndex: 'jobConfig',
                flex: 1,
                renderer: function (value, medate, record) {
                    if (value) {
                        return value.jobType ? value.jobType : '组合';
                    }
                }
            },
        ];
        Ext.define('GridFieldWithCRUD.DataWindow', {
            extend: 'Ext.window.Window',
            modal: true,
            constrain: true,
            gridField: null,//外围的gridField,
            outGrid: null,//gridField的gird
            saveHandler: null,//添加数据时的操作
            layout: 'fit',
            winTitle: null,//自定义的title
            isReadOnly: false,
            searchGridCfg: null,
            excludeIdType: 'String',//id数据类型
            displayfieldValue: null,
            initComponent: function () {
                var me = this;
                me.title = me.winTitle || (i18n.getKey('optional') + me.gridField.getFieldLabel());
                //设置需要排除的数据
                var data = me.gridField.getSubmitValue();
                var excludeIds = [];
                for (var i = 0; i < data.length; i++) {
                    excludeIds.push(data[i]._id || data[i].id);
                }
                if (me.searchGridCfg.filterCfg.items) {

                } else {
                    me.searchGridCfg.filterCfg.items = [];
                }
                me.searchGridCfg.filterCfg.items = me.searchGridCfg.filterCfg.items.concat({
                    name: 'excludeIds',
                    xtype: 'textfield',
                    isLike: false,
                    hidden: true,
                    isNumber: me.excludeIdType == 'Number',
                    value: Ext.isEmpty(excludeIds) ? null : '[' + excludeIds.toString() + ']',
                    allowReset: false,//不允许重置时清除该字段里面的数据
                    itemId: 'excludeIds'
                })
                me.searchGridCfg.gridCfg.store = me.searchGridCfg.gridCfg.storeCfg.clazz ?
                    Ext.create(me.searchGridCfg.gridCfg.storeCfg.clazz, me.searchGridCfg.gridCfg.storeCfg) :
                    me.searchGridCfg.gridCfg.storeCfg.store;
                me.items = [
                    Ext.Object.merge({
                        xtype: 'searchcontainer',
                        itemId: 'grid'
                    }, me.searchGridCfg)
                ];
                me.bbar = [
                    '->',
                    {
                        xtype: 'button',
                        iconCls: 'icon_save',
                        disabled: me.isReadOnly,
                        text: i18n.getKey('confirm'),
                        handler: me.saveHandler || function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            var grid = win.getComponent('grid').grid;
                            var selection = grid.selectedRecords;
                            if (selection.length > 0) {
                                for (var i = 0; i < selection.length; i++) {
                                    win.outGrid.store.proxy.data.push(selection.getAt(i).getData());
                                }
                            }
                            win.outGrid.store.load();
                            win.close();
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'icon_cancel',
                        text: i18n.getKey('cancel'),
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            win.close();
                        }
                    }
                ];
                me.callParent();
            },
        });
        me.items = [
            {
                xtype: 'toolbar',
                color: 'black',
                width: '100%',
                bodyStyle: 'border-color:white;',
                border: '0 0 1 0',
                margin: '0 0 25 0',
                itemId: 'relationGroupToolBar',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        value: "<font style= ' color:green;font-weight: bold'>" + me.displayfieldValue + '</font>'
                    },
                    {
                        xtype: 'button',
                        itemId: 'button',
                        iconCls: 'icon_add',
                        count: 0,
                        componentCls: 'btnOnlyIcon',
                        handler: me.addHandler || function (btn) {
                            var grid = btn.ownerCt.ownerCt.gridConfig;
                            var win = Ext.create('GridFieldWithCRUD.DataWindow', Ext.Object.merge({
                                gridField: me,
                                outGrid: grid,
                                isReadOnly: me.readOnly,
                                data: null,
                                winTitle: me.winTitle,
                                saveHandler: me.saveHandler,
                                searchGridCfg: Ext.clone(me.searchGridCfg),
                            }, me.dataWindowCfg));
                            win.show();
                        }
                    }
                ]
            },
        ];
        me.gridConfig.columns = [{
            xtype: 'actioncolumn',
            itemId: 'actioncolumn',
            width: 30,
            sortable: false,
            tdCls: 'vertical-middle',
            resizable: false,
            menuDisabled: true,
            items: [
                {
                    iconCls: 'icon_remove icon_margin',
                    itemId: 'actionremove',
                    tooltip: 'Remove',
                    disabled: me.readOnly,
                    handler: me.deleteHandler || function (view, rowIndex, colIndex) {
                        var store = view.getStore();
                        store.removeAt(rowIndex);
                        if (store.proxy.data) {//处理本地数据
                            store.proxy.data.splice(rowIndex, 1);
                        }
                    }
                }
            ]
        }].concat(me.searchGridCfg.gridCfg.columns);
        me.callParent();
    }
})
