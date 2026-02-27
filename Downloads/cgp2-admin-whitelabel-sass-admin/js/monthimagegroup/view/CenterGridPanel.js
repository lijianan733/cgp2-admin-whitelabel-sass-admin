/**
 * Created by nan on 2021/2/3
 */
Ext.define('CGP.monthimagegroup.view.CenterGridPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.centergridpanel',
    layout: 'fit',
    imageDataObject: null,
    imageData: null,
    isValid: function () {
        var me = this;
        var isValid = true;
        var grid = me.getComponent('grid');
        for (var i = 0; i < grid.store.proxy.data.length; i++) {
            var item = grid.store.proxy.data[i];
            if (item.printFile && item.imageName) {

            } else {
                isValid = false;
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('当前配置缺失部分月份的PDF或PNG'));
                break;
            }
        }
        return isValid;
    },
    getValue: function () {
        var me = this;
        var grid = me.getComponent('grid');
        return Ext.clone(grid.store.proxy.data);
    },
    setValue: function (data) {
        var me = this;
        var grid = me.getComponent('grid')
        grid.store.proxy.data = data || [];
        me.imageData = data;
        me.imageDataObject = {};
        for (var i = 0; i < me.imageData.length; i++) {
            var key = me.imageData[i].year + '' + me.imageData[i].month;
            me.imageDataObject[key] = Ext.clone(me.imageData[i]);
        }
        grid.store.load();
    },
    uploadFiles: function (fileArray, grid) {
        grid.el.mask('上传中...');
        var centerPanel = grid.ownerCt;
        var cgpFormData = new FormData();
        var count = 0;
        var fileCount = fileArray.length;
        for (var i = 0; i < fileCount; i++) {
            cgpFormData.set("files", fileArray[i]);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (event) {
                if (this.readyState == 4) {
                    if (event.currentTarget.status == 200) {
                        count++;
                       ;
                        var responseText = event.currentTarget.responseText;
                        var responseData = Ext.JSON.decode(responseText);
                        var filesData = responseData.data;
                        for (var i = 0; i < filesData.length; i++) {
                            var sourceName = filesData[i].originalFileName;
                            sourceName = sourceName.split('.')[0];
                            var year = sourceName.slice(0, 4);
                            var month = sourceName.slice(4,);
                            var rawData = {
                                clazz: "com.qpp.cgp.domain.preprocess.holiday.MonthImage",
                                month: month,
                                sourceName: sourceName + '.pdf',
                                year: year
                            };
                            if (filesData[i].format == 'pdf') {
                                rawData.printFile = filesData[i].name;
                            } else {
                                rawData.imageName = filesData[i].name;
                            }
                            if (centerPanel.imageDataObject[sourceName + '']) {//已经存在,更新数据
                                centerPanel.imageDataObject[sourceName + ''] = Ext.Object.merge(centerPanel.imageDataObject[sourceName + ''], rawData)
                            } else {
                                //添加展示组件
                                centerPanel.imageDataObject[sourceName + ''] = rawData;
                            }
                            if (count == fileCount) {
                                grid.el.unmask();
                                var newImageData = [];
                                for (var i in centerPanel.imageDataObject) {
                                    newImageData.push(centerPanel.imageDataObject[i]);
                                }
                                centerPanel.refreshData(newImageData);
                            }
                        }
                    } else {
                        count++;
                        grid.el.unmask();
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('上传失败'));
                    }
                }
            };
            xhr.open("POST", adminPath + 'api/files');
            xhr.setRequestHeader('Authorization', 'Bearer ' + Ext.util.Cookies.get('token'));
            xhr.setRequestHeader('Accept', '*/*');
            const body = cgpFormData;
            xhr.send(body);
        }
    },
    checkConfigInfo: function (record, grid) {
        var win = Ext.create('Ext.window.Window', {
            title: '月份图配置',
            modal: true,
            constrain: true,
            items: [
                {
                    xtype: 'errorstrickform',
                    defaults: {
                        width: 450,
                        margin: '10 25 5 25'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'sourceName',
                            fieldLabel: i18n.getKey('sourceName'),
                            readOnly: true,
                            hidden: true,
                            fieldStyle: 'background-color: silver',//设置文本框的样式
                        },
                        {
                            xtype: 'combo',
                            name: 'year',
                            readOnly: true,
                            fieldStyle: 'background-color: silver',//设置文本框的样式
                            fieldLabel: i18n.getKey('year'),
                            valueField: 'id',
                            displayField: 'id',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['id'],
                                data: [{
                                    id: '12313'
                                }]
                            })
                        },
                        {
                            xtype: 'textfield',
                            name: 'clazz',
                            hidden: true,
                            value: "com.qpp.cgp.domain.preprocess.holiday.MonthImage"
                        },
                        {
                            xtype: 'textfield',
                            name: 'month',
                            readOnly: true,
                            fieldStyle: 'background-color: silver',//设置文本框的样式
                            fieldLabel: i18n.getKey('month')
                        },
                        {
                            xtype: 'fileuploadv2',
                            name: 'imageName',
                            valueUrlType: 'part',   //完整路径 full, 部分路径 part, 文件信息 object
                            allowFileType: ['image/png'],
                            fieldLabel: i18n.getKey('月份图(PNG)'),
                        },
                        {
                            xtype: 'fileuploadv2',
                            name: 'printFile',
                            allowFileType: ['application/pdf'],
                            valueUrlType: 'part',   //完整路径 full, 部分路径 part, 文件信息 object
                            fieldLabel: i18n.getKey('月份图(PDF)'),
                        }
                    ],
                    bbar: [
                        '->',
                        {
                            xtype: 'button',
                            text: i18n.getKey('confirm'),
                            iconCls: 'icon_agree',
                            handler: function (btn) {
                                var form = btn.ownerCt.ownerCt;
                                var win = form.ownerCt;
                                var data = form.getValue();
                                console.log(data);
                                var store = record.store;
                                var index = record.index;
                                store.proxy.data[index] = data;
                                for (var i in data) {
                                    record.set(i, data[i]);
                                }
                                win.close();
                            }
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('cancel'),
                            iconCls: 'icon_cancel',
                            handler: function (btn) {
                                var form = btn.ownerCt.ownerCt;
                                var win = form.ownerCt;
                                win.close();
                            }
                        }
                    ],
                    listeners: {
                        afterrender: function () {
                            var form = this;
                            if (record) {
                                form.setValue(record.getData());
                            }
                        }
                    }
                }
            ]
        })
        win.show();
    },
    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'pagingmemory'
            },
            fields: [
                {
                    name: 'id',
                    type: 'number',
                    convert: function (value, record) {
                        return Number(record.raw.year) + Number(record.raw.month);
                    }
                },
                {
                    name: 'year',
                    type: 'number'
                },
                {
                    name: 'month',
                    type: 'number'
                },
                {
                    name: 'imageName',
                    type: 'string'
                },
                {
                    name: 'printFile',
                    type: 'string'
                },
                {
                    name: 'sourceName',
                    type: 'string'
                },
                {
                    name: 'clazz',
                    type: 'string'
                }
            ],
            data: []
        });
        me.items = [
            {
                xtype: 'grid',
                hidden: true,
                selType: 'checkboxmodel',
                tbar: [
                    {
                        xtype: 'filefield',
                        buttonOnly: true,
                        buttonConfig: {
                            iconCls: 'icon_folder',
                            text: i18n.getKey('选择文件')
                        },
                        /**
                         * 设置文件上传组件的配置
                         * @param grid
                         */
                        supporMultFn: function (grid) {
                            //允许使用的文件类型
                            var typeArray = [
                                "application/pdf",
                                "image/png",
                            ];
                            var fileDom = grid.getEl().down('input[type=file]');
                            fileDom.dom.setAttribute("multiple", "multiple");
                            fileDom.dom.setAttribute("accept", typeArray.join(","));
                            if (!Ext.isEmpty(this.uploadFolder) && this.uploadFolder == true) {
                                fileDom.dom.setAttribute('webkitdirectory', 'webkitdirectory');
                            }
                        },
                        listeners: {
                            afterrender: function () {
                                this.supporMultFn(this);
                            },
                            change: function (comp, newValue, oldValue) {
                                this.supporMultFn(this);
                                var grid = comp.ownerCt.ownerCt;
                                var centerPanel = grid.ownerCt;
                                var files = this.fileInputEl.dom.files;
                                centerPanel.uploadFiles(files, grid);
                                //可以重复上传同一名称的图片
                                this.fileInputEl.el.dom.value = null;
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('delete'),
                        iconCls: 'icon_delete',
                        handler: function (btn) {
                            var grid = btn.ownerCt.ownerCt;
                            var store = grid.store;
                            var selection = grid.getSelectionModel().getSelection();
                            if (selection.length > 0) {
                                Ext.Msg.confirm('提示', '确定删除？', callback);

                                function callback(id) {
                                    if (id === 'yes') {
                                        for (var i = 0; i < selection.length; i++) {
                                            store.proxy.data.splice(selection[i].index, 1);
                                        }
                                        store.load();
                                    }
                                }
                            }
                        }
                    }
                ],
                itemId: 'grid',
                columns: [
                    {
                        xtype: 'rownumberer',
                        width: 40,
                        tdCls: 'vertical-middle',
                        sortable: false
                    },
                    {
                        xtype: 'actioncolumn',
                        width: 50,
                        sortable: false,
                        items: [
                            {
                                iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                                tooltip: 'Edit',
                                handler: function (view, rowIndex, colIndex, a, b, record) {
                                    var grid = view.ownerCt;
                                    var panel = grid.ownerCt;
                                    panel.checkConfigInfo(record);
                                }
                            },
                            {
                                iconCls: 'icon_remove icon_margin',
                                tooltip: 'Delete',
                                handler: function (view, rowIndex, colIndex, a, b, record) {
                                    var store = record.store;
                                    var index = record.index;
                                    Ext.Msg.confirm('提示', '确定删除？', callback);

                                    function callback(id) {
                                        if (id === 'yes') {
                                            store.proxy.data.splice(index, 1);
                                            store.load();
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        dataIndex: 'month',
                        sortable: false,
                        text: i18n.getKey('year') + i18n.getKey('month'),
                        renderer: function (value, mateData, record) {
                            return record.get('year') + '-' + value;
                        }
                    },
                    {
                        dataIndex: 'imageName',
                        text: i18n.getKey('builder预览图'),
                        xtype: 'componentcolumn',
                        width: 250,
                        tdCls: 'vertical-middle',
                        renderer: function (value, metadata, record) {
                            if (value) {
                                var imageUrl = imageServer + value;
                                var imageName = value;
                                var preViewUrl = null;
                                preViewUrl = imageUrl + '?width=100&height=100';
                                return {
                                    xtype: 'container',
                                    height: 100,
                                    layout: {
                                        type: 'vbox',
                                        align: 'center',
                                    },
                                    items: [{
                                        xtype: 'imagecomponent',
                                        src: preViewUrl,
                                        imgCls: 'imgDiv',
                                        autoEl: {
                                            tag: 'div',
                                            cls: 'imgLoading',
                                            style: {
                                                'textAlign': 'center',
                                                'cursor': 'pointer',
                                                'z-index': 10,
                                                'backgroundImage': path + 'ClientLibs/extjs/resources/ext-theme-neptune/images/grid/loading.gif'
                                            }
                                        },
                                        listeners: {
                                            el: {
                                                click: function () {
                                                   ;
                                                    var win = Ext.create('Ext.ux.window.CheckImageWindow', {
                                                        src: imageUrl,
                                                        title: i18n.getKey('图片_') + imageName
                                                    });
                                                    win.show();
                                                },
                                            },
                                            afterrender: function () {
                                                this.imgEl.el.dom.onload = function () {
                                                    try {
                                                        this.parentNode.style.backgroundImage = "url()"
                                                    } catch (e) {
                                                    }
                                                }
                                            }
                                        }

                                    }]
                                }
                            }
                        }
                    },
                    {
                        dataIndex: 'printFile',
                        flex: 1,
                        sortable: false,
                        xtype: 'componentcolumn',
                        text: i18n.getKey('排版PDF'),
                        renderer: function (value, mateData, record, col, row, store, gridView) {
                            mateData.tdAttr = 'data-qtip="查看图片"';
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + value + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            var url = path + 'js/common/pdfpreview/web/viewer.html?file=' + imageServer + value
                                            JSOpenWin({
                                                title: i18n.getKey('排版PDF'),
                                                url: url,
                                                height: 350,
                                                width: 700,
                                                modal: true
                                            });
                                        });
                                    }
                                }
                            };
                        }
                    }
                ],
                store: store,
                bbar: {
                    xtype: 'pagingtoolbar',
                    store: store,
                    displayInfo: true, // 是否 ? 示， 分 ? 信息
                    emptyMsg: i18n.getKey('noData')
                }
            }
        ];
        me.callParent();
    },
    refreshData: function (imageData) {
        var me = this;
        var grid = me.getComponent('grid')
        if (imageData) {
            grid.show();
            me.setValue(imageData);
        } else {
            grid.hide();
        }
    }
})
