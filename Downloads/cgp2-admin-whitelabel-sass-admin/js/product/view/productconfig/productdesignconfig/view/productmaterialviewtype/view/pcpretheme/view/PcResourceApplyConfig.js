/**
 * Created by nan on 2021/10/13
 */
Ext.Loader.syncRequire([
    'CGP.pcresourcelibrary.view.ResourceGridCombo',
    'CGP.businesstype.store.BusinessTypeStore',
    'CGP.pcresourcelibrary.store.PCResourceItemStore',
    'CGP.virtualcontainertype.store.VirtualContainerObjectStore',
    'CGP.virtualcontainertype.store.VirtualContainerTypeStore',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.store.ResourceItemStore'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.PcResourceApplyConfig', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.pcresourceapplyconfig',
    defaults: {
        width: 450
    },
    labelStyle: "display:none",
    pcsData: null,
    diySetValue: function (data) {
        var me = this;
        if (data && data.resource) {
            if (data.resource.clazz == 'com.qpp.cgp.domain.pcresource.virtualcontainer.VirtualContainerType') {
                data.isVCT = true;
            } else {
                data.isVCT = false;
            }
        }
        me.setValue(data);
    },
    initComponent: function () {
        var me = this;
        var businessTypeUniqueId = JSGetUUID();
        var businessTypeStore = Ext.create('CGP.businesstype.store.BusinessTypeStore');
        var PCResourceItemStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.store.ResourceItemStore', {
            autoLoad: false,
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/pcresourceItems/businessLibrary/{businessLibraryId}/mvt/{mvtId}/level',
                reader: {
                    type: 'json',
                    root: 'data.content'
                },
                //重写uxrest中的方法，可以自由定义url的路径内容
                doRequest: function (operation, callback, scope) {
                    var me = this;
                   
                    var writer = this.getWriter(),
                        filter = this.filter,
                        attributeValues = this.attributeValues;
                    var request = this.buildRequest(operation);
                    if (operation.allowWrite()) {
                        request = writer.write(request);
                    }
                    //合并接口里面所有返回数据
                    me.mergeDate(request);
                    //如果设置了filter控件，加入filter查询条件
                    if (filter && Ext.isFunction(filter.getQuery) && operation.action === 'read') {
                        var query = filter.getQuery();
                        var mvtId = JSGetQueryString('mvtId');
                        var url = adminPath + 'api/pcresourceItems/businessLibrary/{businessLibraryId}/mvt/{mvtId}/level';
                        request.url = url.replace('{businessLibraryId}', query[0].value);
                        request.url = request.url.replace('{mvtId}', mvtId);
                    }
                    if (attributeValues && Ext.isFunction(attributeValues.getQuery) && operation.action === 'read') {
                        var attributeValuesQuery = attributeValues.getQuery();
                        if (Ext.isObject(attributeValuesQuery) || (Ext.isArray(attributeValuesQuery) && attributeValuesQuery.length > 0)) {
                            request.params.attributeValues = Ext.encode(attributeValuesQuery);
                        }
                    }
                    Ext.apply(request, {
                        binary: this.binary,
                        headers: this.headers,
                        timeout: this.timeout,
                        scope: this,
                        callback: this.createRequestCallback(request, operation, callback, scope),
                        method: this.getMethod(request),
                        disableCaching: false, // explicitly set it to false, ServerProxy handles caching
                    });
                    request.headers = request.headers || {};
                    Ext.apply(request.headers, {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    });
                    Ext.Ajax.request(request);
                    return request;
                }
            },
        });
        var containerObjectStore = Ext.create('CGP.virtualcontainertype.store.VirtualContainerObjectStore', {
            autoLoad: false,
        });
        var VCTStore = Ext.create('CGP.virtualcontainertype.store.VirtualContainerTypeStore');
        me.items = [
            {
                xtype: 'jsonpathselector',
                itemId: 'targetSelector',
                name: 'targetSelector',
                fieldLabel: i18n.getKey('targetSelector'),
                rawData: me.pcsData
            },
            {
                xtype: 'combo',
                name: 'isVCT',
                fieldLabel: i18n.getKey('是否为VCT资源'),
                itemId: 'isVCT',
                editable: false,
                valueField: 'value',
                displayField: 'display',
                value: false,
                store: {
                    xtype: 'store',
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: true,
                            display: i18n.getKey('true')
                        },
                        {
                            value: false,
                            display: i18n.getKey('false')
                        }
                    ]
                },
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var me = this;
                        var VCTResource = field.ownerCt.getComponent('VCTResource');
                        var resource = field.ownerCt.getComponent('resource');
                        var VCO = field.ownerCt.getComponent('resourceBuilderConfig');
                        VCTResource.setVisible(newValue);
                        resource.setVisible(!newValue);
                        VCO.setVisible(newValue);
                        VCTResource.setDisabled(!newValue);
                        resource.setDisabled(newValue);
                        VCO.setDisabled(!newValue);
                    }
                }
            },
            {
                xtype: 'gridcombo',
                name: 'resource',
                itemId: 'VCTResource',
                fieldLabel: i18n.getKey('VCT资源'),
                editable: false,
                store: VCTStore,
                valueField: '_id',
                allowBlank: false,
                displayField: 'displayName',
                matchFieldWidth: false,
                gridCfg: {
                    height: 400,
                    width: 550,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    columns: [
                        {
                            dataIndex: '_id',
                            text: i18n.getKey('id')
                        },
                        {
                            dataIndex: 'description',
                            width: 250,
                            text: i18n.getKey('description')
                        },
                        {
                            dataIndex: 'argumentType',
                            text: i18n.getKey('argumentType'),
                            xtype: 'componentcolumn',
                            flex: 1,
                            renderer: function (value, metaData, record, rowIndex) {
                                return {
                                    xtype: 'displayfield',
                                    value: "<a href='#'>" + value._id + "</font>",
                                    listeners: {
                                        render: function (display) {
                                            display.getEl().on("click", function () {
                                                JSOpen({
                                                    id: 'rttypespage',
                                                    url: path + 'partials/rttypes/rttype.html?rtType=' + value._id,
                                                    title: i18n.getKey('RtType'),
                                                    refresh: true
                                                });
                                            });
                                        }
                                    }
                                }
                            }
                        },
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: VCTStore,
                    }
                },
                hidden: true,
                disabled: true,
                gotoConfigHandler: function (event) {
                    var me = this;
                    var modelId = this.getSubmitValue()[0];
                    JSOpen({
                        id: 'virtualcontainertypepage',
                        url: path + 'partials/virtualcontainertype/main.html?_id=' + modelId,
                        title: i18n.getKey('virtualContainerType'),
                        refresh: true,
                    })
                },
                diyGetValue: function () {
                    var me = this;
                    var data = me.getArrayValue();
                    if (data) {
                        return data;
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data && data.clazz == 'com.qpp.cgp.domain.pcresource.virtualcontainer.VirtualContainerType') {
                        me.setInitialValue([data._id]);
                    }
                },
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'resourceBuilderConfig',
                itemId: 'resourceBuilderConfig',
                allowBlank: false,
                hidden: true,
                disabled: true,
                layout: 'hbox',
                defaults: {},
                items: [
                    {
                        xtype: 'gridcombo',
                        name: 'resourceBuilderConfig',
                        fieldLabel: i18n.getKey('VCO'),
                        itemId: 'resourceBuilderConfig',
                        allowBlank: false,
                        editable: false,
                        store: containerObjectStore,
                        matchFieldWidth: false,
                        displayField: 'diyDisplay',
                        valueField: '_id',
                        valueType: 'idReference',
                        flex: 1,
                        gridCfg: {
                            height: 350,
                            width: 500,
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    dataIndex: '_id'
                                },
                                {
                                    text: i18n.getKey('description'),
                                    flex: 1,
                                    dataIndex: 'description',
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                }
                            ],
                            bbar: {
                                xtype: 'pagingtoolbar',
                                store: containerObjectStore
                            }
                        },
                        diySetValue: function (data) {
                            if (data) {
                                this.setInitialValue([data._id]);
                            }
                        },
                        diyGetValue: function (data) {
                            return this.getArrayValue();
                        },
                        gotoConfigHandler: function (event) {
                            var me = this;
                            var modelId = this.getSubmitValue()[0];
                            JSOpen({
                                id: 'virtualcotainerobject/app/viewpage',
                                url: path + 'partials/virtualcotainerobject/app/view/main.html?_id=' + modelId,
                                title: i18n.getKey('virtualCotainerObject'),
                                refresh: true,
                            })
                        },
                    },
                    {
                        xtype: 'button',
                        itemId: 'addVCO',
                        text: i18n.getKey('create') + i18n.getKey('VCO'),
                        iconCls: 'icon_add',
                        margin: '0 0 0 5',
                        width: 100,
                        handler: function (btn) {
                            var VCT = btn.ownerCt.ownerCt.getComponent('VCTResource').getArrayValue();
                            if (VCT) {
                                var tabId = 'virtualcontainerobject/app/view' + '_edit';
                                JSOpen({
                                    id: tabId,
                                    url: path + "partials/" + 'virtualcontainerobject/app/view' + "/edit.html?vctId=" + VCT._id,
                                    title: 'create' + '_' + i18n.getKey('VCO')
                                });
                            } else {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择VCT资源'));
                            }
                        }
                    }
                ],
                diySetValue: function (data) {
                    var me = this;
                    me.getComponent('resourceBuilderConfig').diySetValue(data);

                },
                diyGetValue: function () {
                    var me = this;
                    return me.getComponent('resourceBuilderConfig').diyGetValue();
                }
            },
            {
                xtype: 'gridcombo',
                name: 'resource',
                itemId: 'resource',
                fieldLabel: i18n.getKey('resources'),
                resourceType: null,//资源类型
                matchFieldWidth: false,
                editable: false,
                store: PCResourceItemStore,
                valueField: '_id',
                displayField: '_id',
                filterCfg: {
                    height: 80,
                    layout: {
                        type: 'column',
                        columns: 2
                    },
                    fieldDefaults: {
                        labelAlign: 'right',
                        layout: 'anchor',
                        style: 'margin-right:20px; margin-top : 5px;',
                    },
                    items: [
                        {
                            name: 'businessLib',
                            xtype: 'gridcombo',
                            fieldLabel: i18n.getKey('businessType'),
                            itemId: 'businessLib',
                            editable: false,
                            width: 350,
                            allowBlank: false,
                            valueField: '_id',
                            displayField: 'diyDisplay',
                            isLike: false,
                            matchFieldWidth: false,
                            store: businessTypeStore,
                            gridCfg: {
                                width: 650,
                                height: 350,
                                columns: [
                                    {
                                        text: i18n.getKey('id'),
                                        dataIndex: '_id',
                                    },
                                    {
                                        text: i18n.getKey('name'),
                                        dataIndex: 'name',
                                        width: 200,
                                    },
                                    {
                                        text: i18n.getKey('resources') + i18n.getKey('type'),
                                        dataIndex: 'type',
                                        flex: 1,
                                        renderer: function (value) {
                                            return value.split('.').pop();
                                        }
                                    }
                                ],
                                bbar: {
                                    xtype: 'pagingtoolbar',
                                    store: businessTypeStore,
                                }
                            },
                            value: {
                                _id: '20808579',
                                clazz: "com.qpp.cgp.domain.pcresource.BusinessLibrary",
                                name: "Layouts",
                                diyDisplay: 'CMYKColor(20808579)',
                                type: "com.qpp.cgp.domain.pcresource.compositedisplayobject.CompositeDisplayObject"
                            },
                        },
                    ]
                },
                gridCfg: {
                    height: 400,
                    width: 550,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    columns: [
                        {
                            text: i18n.getKey('resources'),
                            dataIndex: 'resource',
                            itemId: 'resource',
                            xtype: 'componentcolumn',
                            flex: 1,
                            renderer: function (value, mateData, record) {
                                var str = JSCreateHTMLTable([
                                    {
                                        title: i18n.getKey('resources') + i18n.getKey('type'),
                                        value: value.clazz.split('.').pop()
                                    },
                                    {
                                        title: i18n.getKey('resources') + i18n.getKey('id'),
                                        value: value._id
                                    }
                                ])
                                return {
                                    xtype: 'component',
                                    html: str,
                                }
                            }
                        },
                        {
                            text: i18n.getKey('resourceItem'),
                            dataIndex: 'displayDescription',
                            itemId: 'displayName',
                            flex: 1,
                            renderer: function (value, mateData, record) {
                                return JSCreateHTMLTable([
                                    {
                                        title: i18n.getKey('id'),
                                        value: record.get('_id')
                                    },
                                    {
                                        title: i18n.getKey('displayName'),
                                        value: value.displayName
                                    }
                                ], 'left')
                            }
                        },
                        {
                            text: i18n.getKey('thumbnail'),
                            dataIndex: 'displayDescription',
                            itemId: 'displayDescription',
                            xtype: 'componentcolumn',
                            width: 100,
                            renderer: function (value, mateData, record) {
                                if (value.clazz == 'com.qpp.cgp.domain.pcresource.DisplayColor') {
                                    return {
                                        xtype: 'displayfield',
                                        value: ('<a class=colorpick style="background-color:' + value.colorCode + '"></a>' + value.colorCode)
                                    }
                                } else {
                                    var imageUrl = imageServer + value.thumbnail;
                                    var imageName = value.displayName;
                                    var preViewUrl = null;
                                    if (imageUrl.indexOf('.pdf') != -1) {
                                        imageUrl += '?format=jpg';
                                    } else {
                                    }
                                    return {
                                        xtype: 'imagecomponent',
                                        src: imageUrl,
                                        autoEl: 'div',
                                        style: 'cursor: pointer',
                                        width: 50,
                                        height: 50,
                                        imgCls: 'imgAutoSize',
                                        listeners: {
                                            afterrender(view){
                                                Ext.create('Ext.ux.window.ImageViewer', {
                                                    imageSrc: imageUrl,
                                                    actionItem: view.el.dom.id,
                                                    winConfig: {
                                                        title: `${i18n.getKey('check')} < ${imageName} > 预览图`
                                                    },
                                                    viewerConfig: null,
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: PCResourceItemStore,
                    }
                },
                allowBlank: false,
                diyGetValue: function () {
                    var me = this;
                    var data = me.getArrayValue();
                    if (data) {
                        return data.resource;
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setValue([{
                            _id: data._id,
                            resource: data
                        }])
                    }
                },
                gotoConfigHandler: function (event) {
                    var me = this;
                   
                    var modelId = this.getSubmitValue()[0];
                    var resource = me.getArrayValue().resource;
                    var map = {
                        'com.qpp.cgp.domain.pcresource.Image': path + 'partials/resource/app/view/image/main.html',
                        'com.qpp.cgp.domain.pcresource.font.Font': path + 'partials/resource/app/view/font/main.html',
                        'color': path + 'partials/resource/app/view/color/main.html',//color有好几种子类
                        'com.qpp.cgp.domain.pcresource.dynamicimage.DynamicSizeImage': path + 'partials/resource/app/view/dynamicSizeImage/main.html',
                        'com.qpp.cgp.domain.pcresource.compositedisplayobject.CompositeDisplayObject': path + 'partials/resource/app/view/compositeDisplayObject/main.html'
                    }
                    var url = '';
                    if (map[resource.clazz]) {
                        url = map[resource.clazz];
                    } else {
                        url = map[resource.color];
                    }
                    JSOpen({
                        id: 'PCResource',
                        url: url + '?_id=' + modelId,
                        title: i18n.getKey('PCResource'),
                        refresh: true,
                    })
                },
            },
            {
                xtype: 'gridcombo',
                name: 'intent',
                fieldLabel: i18n.getKey('intent'),
                itemId: 'intent',
                allowBlank: false,
                displayField: 'diyDisplay',
                valueField: '_id',
                editable: false,
                haveReset: true,
                store: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.store.ResourceApplyIntentStore'),
                matchFieldWidth: false,
                valueType: 'idReference',
                tipInfo: '规定了资源在目标选择器选出来的元素上是替换还是添加<br>', /*+
                    '且可以替换或添加操作的元素属性名<br>' +
                    'ResourceConvertConfig:对资源进行代码转换,比如把图片资源转换为url或base64',*/
                gridCfg: {
                    height: 350,
                    width: 500,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id'
                        },
                        {
                            text: i18n.getKey('name'),
                            flex: 1,
                            dataIndex: 'name',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('code'),
                            flex: 1,
                            dataIndex: 'code',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        }, {
                            text: i18n.getKey('targetType'),
                            flex: 1,
                            dataIndex: 'targetType',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        }
                    ],
                },
                diySetValue: function (data) {
                    if (data) {
                        this.setInitialValue([data._id]);
                    }
                },
                diyGetValue: function (data) {
                    return this.getArrayValue();
                },
            },
            {
                xtype: 'combo',
                name: 'convertConfig',
                fieldLabel: i18n.getKey('convertConfig'),
                itemId: 'convertConfig',
                allowBlank: true,
                editable: false,
                hidden: true,
                valueField: 'value',
                displayField: 'display',
                haveReset: true,
                store: {
                    xtype: 'store',
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.theme.ImageConvertConfig',
                            display: 'ImageConvertConfig'
                        },
                        {
                            value: 'com.qpp.cgp.domain.theme.TextConvertConfig',
                            display: 'TextConvertConfig'
                        }
                    ]
                },
                diyGetValue: function () {
                    var clazz = this.getValue();
                    if (clazz) {
                        return {
                            clazz: this.getValue()
                        }
                    }
                },
                diySetValue: function (data) {
                    if (data) {
                        this.setValue(data.clazz);
                    }
                }
            },
            {
                xtype: 'textfield',
                name: 'clazz',
                itemId: 'clazz',
                hidden: true,
                fieldLabel: i18n.getKey('clazz'),
                value: 'com.qpp.cgp.domain.theme.PcResourceApplyConfig'
            }
        ];
        me.callParent(arguments);
    }
})