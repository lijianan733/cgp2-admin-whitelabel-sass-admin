/**
 * Created by miao on 2021/8/26.
 */
Ext.Loader.setPath('CGP.resource', '../../../app');
Ext.define('CGP.resource.view.dynamicSizeImage.fixSizeImageConfig.Main', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.fixsizeimagemain',
    config: {
        i18nblock: i18n.getKey('fixSizeDisplayObject'),
        block: 'resource/app/view/compositeDisplayObject/fixSizeDisplayObject',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,
        tbarCfg: {
            btnCreate: {
                itemId:'createbtn',
                handler: function (btn) {
                    var controller=Ext.create('CGP.resource.controller.FixSizeImageConfig');
                    controller.editHandler(btn);
                }
            }
        },
        gridCfg: {
            editActionHandler:function (grid, rowIndex, colIndex){
                var rec = grid.getStore().getAt(rowIndex);
                var controller=Ext.create('CGP.resource.controller.FixSizeImageConfig');
                controller.editHandler(this,rec.get('_id'));
            },
            store: 'FixSizeImageConfig',
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 80
                },
                {
                    text: i18n.getKey('imageName'),
                    dataIndex: 'imageName',
                    flex: 1,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('width') + i18n.getKey('height'),
                    dataIndex: 'imageWidth',
                    xtype: 'gridcolumn',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        var result = '宽:' + value + ' , ';
                        result += '高:' + record.get('imageHeight')
                        metadata.tdAttr = 'data-qtip="' + result + '"';
                        return result;
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            defaults: {
                isLike: false
            },
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    hideTrigger: true,
                    listeners: {
                        render: function (comp) {
                            var searchId = JSGetQueryString('id');
                            if (searchId) {
                                comp.setValue(searchId);
                            }
                        }
                    }
                },
                {
                    id: 'imageNameSearch',
                    itemId: 'imageNameSearch',
                    name: 'imageName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('imageName'),
                },
                {
                    id: 'dsId',
                    itemId: 'dsId',
                    name: 'dynamicSizeImage._id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('dsId'),
                    hidden:true,
                    listeners: {
                        added: function (comp) {
                            var dsId = JSGetQueryString('dsId');
                            if (dsId) {
                                comp.setValue(dsId);
                            }
                        }
                    }
                },
            ]
        }
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
});