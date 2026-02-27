/**
 * Created by nan on 2021/9/7
 */
Ext.Loader.syncRequire([
    'CGP.pcresourcelibrary.store.ResourceStore',
    'CGP.pcresourcelibrary.config.Config'
]);
Ext.define("CGP.pcresourcelibrary.view.ResourceGridCombo", {
    extend: 'Ext.form.field.GridComboBox',
    alias: 'widget.resourcegridcombo',
    valueField: '_id',
    valueType: 'idReference',
    displayField: 'display',
    editable: false,
    matchFieldWidth: false,
    multiSelect: false,
    resourceType: null,
    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.pcresourcelibrary.store.ResourceStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'clazz',
                    type: 'string',
                    value: me.resourceType
                }])
            }
        });
        var url = '';
        var IPCResourceType = CGP.pcresourcelibrary.config.Config.IPCResourceType;
        IPCResourceType.forEach(function (item) {
            if (item.value == me.resourceType) {
                url = item.url;
            }
        });
       ;
        me.store.model.getProxy();
        me.store.model.proxy.url = url;
        me.gridCfg = {
            height: 400,
            width: 670,
            columns: [
                {
                    xtype: 'rownumberer',
                    width: 30
                },
                {
                    dataIndex: '_id',
                    text: i18n.getKey('id'),
                    flex: 1
                },
                {
                    dataIndex: 'name',
                    flex: 2,
                    text: i18n.getKey('name')
                },
                {
                    dataIndex: 'description',
                    text: i18n.getKey('description'),
                    flex: 2
                },
                {
                    text: i18n.getKey('thumbnail'),
                    dataIndex: 'thumbnail',
                    xtype: 'componentcolumn',
                    width: 120,
                    renderer: function (value, mateData, record) {
                        if (value) {
                            var imageUrl = imageServer + value;
                            var imageName = record.get('name');
                            var preViewUrl = null;
                            if (imageUrl.indexOf('.pdf') != -1) {
                                imageUrl += '?format=jpg';
                                preViewUrl = imageUrl + '&width=100&height=100';
                            } else {
                                preViewUrl = imageUrl + '?width=100&height=100';
                            }
                            return {
                                xtype: 'imagecomponent',
                                src: preViewUrl,
                                autoEl: 'div',
                                style: 'cursor: pointer',
                                width: 50,
                                height: 50,
                                imgCls: 'imgAutoSize',
                                listeners: {
                                    afterrender:function(view){
                                        Ext.create('Ext.ux.window.ImageViewer', {
                                            imageSrc: imageUrl,
                                            actionItem: view.el.dom.id,
                                            winConfig: {
                                                title: `${i18n.getKey('check')} < ${value.thumbnail} > 预览图`
                                            },
                                            viewerConfig: null,
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: me.store,
            }
        };
        me.callParent();
    },
    diyGetValue: function () {
        var me = this;
        return me.getArrayValue();
    },
    diySetValue: function (data) {
        var me = this;
        if (data) {
            me.setInitialValue([data._id]);
        }
    },
    getDisplayValue: function () {
        var me = this,
            dv = [];
        Ext.Object.each(me.value, function (k, v) {
            var a = v['name'] + '(' + v['_id'] + ')';
            if (!Ext.isEmpty(a))
                dv.push(a);
        });
        return dv.join(',');
    },
})