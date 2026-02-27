/**
 * Created by nan on 2020/2/19.
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.store.TemplateConfigStore',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.model.TemplateConfigModel',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.view.EditTemplateConfigWindow',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.model.ProductMaterialViewTypeVersionFiveModel',
    'CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.model.SimplifySBOMMaterialViewType',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.controller.Controller'
])
Ext.onReady(function () {
    // 用于下面的资源
    // 初始化资源
    // 创建一个GridPage控件
    var productMaterialViewTypeId = JSGetQueryString('mvtId');
    var mvtType = JSGetQueryString('mvtType') || 'pmvt';
    var includeIds = [];
    var mvtData = '';//获取到对应的mvt数据
    var hadFileType = [];//记录已经包含的文件类型
    var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.controller.Controller');
    if (mvtType == 'pmvt') {
        CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.model.ProductMaterialViewTypeVersionFiveModel.load(productMaterialViewTypeId, {
            scope: this,
            success: function (record) {
                mvtData = record.raw;
            }
        })
    } else {
        CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.model.SimplifySBOMMaterialViewType.load(productMaterialViewTypeId, {
            scope: this,
            success: function (record) {
                mvtData = record.raw
            }
        })
    }
    Ext.Ajax.request({
        url: adminPath + 'api/templateConfigController/findByMVT/' + productMaterialViewTypeId,
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        async: false,
        success: function (response) {
            var responseMessage = Ext.JSON.decode(response.responseText);
            if (responseMessage.success) {
                for (var i = 0; i < responseMessage.data.length; i++) {
                    includeIds.push(responseMessage.data[i]._id);
                }
            } else {
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        },
        failure: function (response) {
            var responseMessage = Ext.JSON.decode(response.responseText);
            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
        }
    });
    var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.store.TemplateConfigStore', {
        params: {
            filter: Ext.JSON.encode([{
                name: 'includeIds',
                type: 'string',
                value: '[' + includeIds.toString() + ']'
            }])
        },
        groupField: 'groupId',
        listeners: {
            load: function (store, records) {
                /*  hadFileType = [];
                  for (var i = 0; i < records.length; i++) {
                      hadFileType.push(records[i].get('fileType'));
                  }*/
            }
        }
    });
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('templateConfig'),
        block: 'templateConfig',
        // 编辑页面
        tbarCfg: {
            btnCreate: {
                text: i18n.getKey('add'),
                handler: function (view) {
                    var grid = view.ownerCt.ownerCt;
                    controller.showBaseConfigWindow(grid, mvtData);
                }
            },
            btnDelete: {
                text: i18n.getKey('delete'),
                handler: function (view, rowIndex, colIndex) {
                    var grid = view.ownerCt.ownerCt;
                    var selected = grid.getSelectionModel().getSelection();
                    var removeIds = [];
                    for (var i = 0; i < selected.length; i++) {
                        removeIds.push(selected[i].getId());
                    }
                    if (removeIds.length > 0) {
                        Ext.MessageBox.confirm(i18n.getKey('confirm'), i18n.getKey('deleteConfirm'), function (btn) {
                            if (btn == 'yes') {
                                controller.deleteTemplateConfig(removeIds, mvtData, grid);
                            }
                        })
                    }
                }
            },
            btnHelp: {
                handler: function (view, rowIndex, colIndex) {
                    Ext.MessageBox.alert(i18n.getKey('prompt'), i18n.getKey('同一分组Id中,3种文件类型的配置都至多存在一个'));
                }
            },
            hiddenButtons: [],//按钮的名称
            disabledButtons: ['config']//按钮的名称
        },
        gridCfg: {
            // store是指store.js
            store: store,
            frame: false,
            hadFileType: hadFileType,
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle'
            },
            features: [
                {
                    ftype: 'grouping',
                    groupHeaderTpl: i18n.getKey('groupId') + ': {name}', //print the number of items in the group
                }
            ],
            editActionHandler: function (gridview, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                Ext.widget('templateconfigwindow', {
                    createOrEdit: 'edit',
                    record: record,
                    mvtData: mvtData,
                    grid: gridview.ownerCt,
                    data: record.getData(),
                }).show();
            },
            deleteActionHandler: function (gridview, rowIndex, colIndex, view, event, record, dom) {
                Ext.MessageBox.confirm(i18n.getKey('confirm'), i18n.getKey('deleteConfirm'), function (btn) {
                    if (btn == 'yes') {
                        var removeId = record.getId();
                        controller.deleteTemplateConfig([removeId], mvtData, gridview.ownerCt);
                    }
                })
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id'
                }, {
                    text:  i18n.getKey('file') + i18n.getKey('type'),
                    dataIndex: 'fileType',
                    itemId: 'fileType',
                }, {
                    text: i18n.getKey('fileName'),
                    dataIndex: 'fileName',
                    itemId: 'fileName'
                },/* {
                text: i18n.getKey('isCheck'),
                dataIndex: 'isCheck',
                itemId: 'isCheck'
            },*/ {
                    text: i18n.getKey('type'),
                    dataIndex: 'clazz',
                    flex: 1,
                    itemId: 'clazz',
                    renderer: function (value) {
                        var result = '';
                        if (value == 'com.qpp.cgp.domain.preprocess.template.PreprocessTemplateConfig') {
                            result = '预处理模板';
                        } else if (value == 'com.qpp.cgp.domain.preprocess.template.StaticProductMaterialViewTypeTemplateConfig') {
                            result = '静态尺寸模板';
                        } else {
                            result = '可变尺寸模板';
                        }
                        return result;
                    }
                }]
        },
        // 查询输入框
        filterCfg: {
            hidden: true
        },
        listeners: {
/*
            afterrender: function () {
                var page = this;
                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                var productId = builderConfigTab.productId;
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
            }
*/
        }
    });
});
