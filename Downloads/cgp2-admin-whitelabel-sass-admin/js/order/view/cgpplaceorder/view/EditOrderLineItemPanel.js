/**
 * Created by nan on 2019/8/21.
 */
Ext.define('CGP.order.view.cgpplaceorder.view.EditOrderLineItemPanel', {
    extend: 'Ext.panel.Panel',
    border: false,
    requires: ['Ext.ux.form.field.TriggerField', 'Ext.ux.form.field.FileField', 'CGP.mailhistory.controller.overridesubmit'],
    layout: 'fit',
    alias: 'widget.editorderlineitempanel',
    photoData: null,
    productInstance: null,
    minCount: null,//需要的最少数量，当仅有该配置，无maxCount时，表明指定只能有minCount数量的pdf
    maxCount: null,//需要的最大数量
    fileArray: null,//复制的filelist，用于创建新的FormData中传输文件
    renderedFileCount: 0,//已经渲染了的数量
    removeFileArr: null,
    header: false,
    controller: Ext.create('CGP.order.view.cgpplaceorder.controller.Controller'),
    uploadFiles: function () {
        var panel = this;
        if (panel.rendered == true) {
            //panel.el.mask('上传中..');
            var cgpFormData = new FormData();
            for (var i = 0; i < panel.fileArray.length; i++) {
                cgpFormData.append("files", panel.fileArray[i]);
            }
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (event) {
                if (this.readyState == 4) {
                   ;
                    //panel.el.unmask();
                    if (event.currentTarget.status == 200) {
                        var responseText = event.currentTarget.responseText;
                        var responseData = Ext.JSON.decode(responseText);
                        panel.photoData.files = panel.photoData.files.concat(responseData.data);
                        panel.fireEvent('uploadFilesSuccess', {
                            success: true
                        });
                    } else {
                        var item = panel;
                        item.fireEvent('uploadFilesSuccess', {
                            success: false,
                            data: {
                                message: item.title + '上传图片失败'
                            }
                        })
                    }
                }
            };
            xhr.open("POST", adminPath + 'api/files');
            xhr.setRequestHeader('Authorization', 'Bearer ' + Ext.util.Cookies.get('token'));
            xhr.setRequestHeader('Accept', '*/*');
            setTimeout(function () {
                xhr.send(cgpFormData);
            }, 100)
        }
    },
    isValid: function () {
        var me = this;
        var currentFileCount = me.fileArray.length + me.photoData.files.length;
        if (currentFileCount < me.minCount) {
            return false;
        }
        if (me.maxCount) {
            if (currentFileCount > me.maxCount) {
                return false;
            }
        } else {
            if (currentFileCount != me.minCount) {
                return false;
            }
        }
        return true;
    },
    initComponent: function () {
        var me = this;
        me.fileArray = [];
        me.newAddPDFArr = [];
        me.removeFileArr = [];
        //添加自定义事件
        this.addEvents({
            countChange: true,//选择的文件数量发生改变
            uploadFilesSuccess: true//执行上传文件操作成功
        });
        /**
         * 删除选择的文件
         * @param itemId
         */
        window.deleteFile = function (itemId) {
            var field = Ext.getCmp(itemId);
            var panel = field.up('editorderlineitempanel');
            var index = field.ownerCt.items.items.indexOf(field);
            var hadUpLoadFileCount = panel.photoData.files.length;
            if (field.fileType == 'unUpload') {
                panel.fileArray.splice(index - hadUpLoadFileCount, 1);
            } else {
                panel.photoData.files.splice(index, 1);
            }
            field.ownerCt.remove(field);
            panel.fireEvent('countChange', {
                count: panel.fileArray.length + panel.photoData.files.length
            });
        };
        /*     /!**
              * 下载文件
              * @param itemId
              *!/
             window.downLoad = function (itemId) {
                 var field = Ext.getCmp(itemId);
                 var fileName = field.fileName;
                 const a = document.createElement('a');
                 a.setAttribute('href', 'http://192.168.26.26:8080/file/file/' + '5d630a3f5615d215fe104cd67a293415.pdf');
                 a.setAttribute("download", fileName);
                 a.click();
             };*/
        /**
         * 查看图片
         * @param itemId
         */
        window.preview = function (itemId, width, height) {
           ;
            var field = Ext.getCmp(itemId);
            var fileName = field.name;
            var canvas = field.el.dom.getElementsByTagName('canvas')[0];
            var img = field.el.dom.getElementsByTagName('img')[0];
            var items = null;
            if (canvas) {
                items = [
                    {
                        xtype: 'panel',
                        autoScroll: true,
                        width: canvas.width > 800 ? 800 : canvas.width + 5,
                        height: canvas.height > 800 ? 800 : canvas.height + 5,
                        bodyStyle: {
                            verticalAlign: 'middle'
                        },
                        items: [
                            {
                                xtype: 'image',
                                width: canvas.width,
                                height: canvas.height,
                                src: canvas.toDataURL()
                            }
                        ]
                    }
                ];
            } else {
                items = [
                    {
                        xtype: 'image',
                        src: img.src,
                        width: field.fileWidth,
                        height: field.fileHeight
                    }
                ]
            }
            var window = Ext.create('Ext.window.Window', {
                title: i18n.getKey(fileName),
                modal: true,
                constrain: true,
                maximizable: true,
                layout: 'fit',
                items: items

            });
            window.show();
        };
        me.items = [
            {
                xtype: 'form',
                border: false,
                header: false,
                width: "100%",
                flex: 1,
                autoScroll: true,
                itemId: 'previewForm',
                layout: {
                    type: 'column'
                },
                bodyStyle: 'border-color:silver;',
                items: [],
                tbar: [
                    {
                        xtype: 'filefield',
                        buttonOnly: true,
                        buttonConfig: {
                            iconCls: 'icon_folder',
                            text: i18n.getKey('选择文件')
                        },
                        supporMultFn: function (field) {
                            var typeArray = [
                                "application/pdf",
                                "image/svg+xml"
                            ];
                            var fileDom = field.getEl().down('input[type=file]');
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
                                var previewForm = comp.ownerCt.ownerCt;
                                var panel = previewForm.ownerCt;
                                var fileInput = this.fileInputEl.dom;
                                var files = this.fileInputEl.dom.files;
                                var filePath = this.value;
                                filePath = filePath.substring(0, filePath.lastIndexOf('\\') + 1);
                                //处理无法重复选择同一文件
                                fileInput.type = 'text';
                                fileInput.type = 'file';
                                //进行图片的预览显示
                                var fileArr = [];
                                Array.prototype.push.apply(fileArr, files);//复制文件信息
                                Ext.Array.each(files, function (item, index) {
                                    var fieldId = JSGetUUID();
                                    var pdfFileURL = filePath + item.name;
                                    if (item.type == 'application/pdf') {
                                        buildcanvas(pdfFileURL, item, fieldId, panel, fileArr, index);
                                    } else {
                                        buildImg(item, fieldId, previewForm, panel, files);
                                    }

                                });

                                /**
                                 *渲染图片类型格式的文件
                                 * @param item
                                 * @param fieldId
                                 * @param previewForm
                                 * @param panel
                                 * @param files
                                 */
                                function buildImg(item, fieldId, previewForm, panel, files) {
                                    var reader = new FileReader();
                                    reader.readAsDataURL(item);
                                    reader.onload = function (e) {
                                        var canvas = document.createElement('canvas');
                                        var ctx = canvas.getContext('2d');
                                        //加载图片
                                        var img = new Image();
                                        img.onload = function () {
                                            canvas.width = img.width;
                                            canvas.height = img.height;
                                            if (canvas.width > canvas.height) {
                                                canvas.style.width = "100%";//以大的一方为约束
                                                canvas.style.position = 'relative';
                                                canvas.style.top = '50%';
                                                canvas.style.left = '50%';
                                                canvas.style.transform = 'translate(-50%,-50%)';
                                            } else {
                                                canvas.style.height = "100%";
                                            }
                                            canvas.onclick = function () {
                                                window.preview(fieldId);
                                            };
                                            canvas.onmouseover = function () {
                                                this.style.cursor = 'pointer';
                                            }
                                            ctx.drawImage(img, 0, 0, img.width, img.height);
                                        }
                                        img.src = reader.result;
                                        var deleteImg = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png';
                                        var previewImg = path + 'ClientLibs/extjs/resources/themes/images//shared/fam/preview.png';
                                        previewForm.add({
                                            id: fieldId,
                                            fileName: item.name,
                                            name: item.name,
                                            xtype: 'displayfield',
                                            columnWidth: 0.2,
                                            fileWidth: item.width,
                                            fileHeight: item.height,
                                            hideLabel: true,
                                            uploadId: JSGetUUID(),
                                            value: "<div>" +
                                                "<div  align='center' style='margin:0px 10px 0px 10px;border: 1px solid #e2e2e4;border-radius:10px;height: auto;height: 150px;' id=" + 'img-' + fieldId + ">" +
                                                "</div>" +
                                                "<div align='center'>" + item.name +
                                                "</div>" +
                                                "<div align='center'>" +
                                                "<img title='删除' src='" + deleteImg + "' style='vertical-align: middle;width:16px; height:16px; margin-right:8px;' onclick='deleteFile(\"" + fieldId + "\")'/>" +
                                                "<img title='查看' src='" + previewImg + "' style='vertical-align: middle;width:16px; height:16px; margin-left:8px;' onclick='preview(\"" + fieldId + "\")'/>" +
                                                "</div>" +
                                                "</div>"
                                        })
                                        var imgDiv = document.getElementById('img-' + fieldId);
                                        imgDiv.append(canvas);
                                        panel.renderedFileCount++;
                                        if (panel.renderedFileCount == files.length) {
                                            Array.prototype.push.apply(panel.fileArray, files);//复制文件信息
                                            panel.fireEvent('allFileRender');
                                        }
                                    }
                                }

                                /**
                                 *渲染pdf文件
                                 * @param pdfFileURL pdf文件路径
                                 * @param file 具体的file类型对象
                                 * @param img  需要渲染图片的位置
                                 */
                                function buildcanvas(pdfFileURL, file, fieldId, panel, files, index) {
                                    var pdfFileURL = pdfFileURL;
                                    if (pdfFileURL) {
                                        var reader = new FileReader();
                                        reader.readAsArrayBuffer(file);
                                        reader.onload = function (e) {
                                            new Uint8Array(e.target.result);
                                            var typedarray = new Uint8Array(this.result);
                                            PDFJS.getDocument(typedarray).then(function (pdf) { //PDF转换为canvas
                                                if (pdf) {
                                                    var pageNum = pdf.numPages;
                                                    for (var i = 1; i <= pageNum; i++) {
                                                        var canvas = document.createElement('canvas');
                                                        canvas.title = '点击查看';
                                                        var context = canvas.getContext('2d');
                                                        openPage(pdf, i, context, panel, files, fieldId, file, index, files.length);
                                                    }
                                                }
                                            });
                                        };
                                    }

                                    /**
                                     * 生成对应的图片渲染异步任务
                                     * @param pdfFile
                                     * @param pageNumber
                                     * @param context
                                     */
                                    function openPage(pdfFile, pageNumber, context, panel, files, fieldId, file, index, filesCount) {
                                        var scale = 1;//比例
                                        pdfFile.getPage(pageNumber).then(function (page) {
                                            var viewport = page.getViewport(scale); // reference canvas via context
                                            var canvas = context.canvas;
                                            canvas.width = viewport.width;
                                            canvas.height = viewport.height;
                                            canvas.onmouseover = function () {
                                                this.style.cursor = 'pointer';
                                            }
                                            canvas.onclick = function () {
                                                window.preview(fieldId);
                                            };
                                            if (true/*Math.round(viewport.width) == panel.widht && Math.round(viewport.height) == panel.height*/) {
                                                var deleteImg = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png';
                                                var previewImg = path + 'ClientLibs/extjs/resources/themes/images//shared/fam/preview.png';
                                                previewForm.add({
                                                    id: fieldId,
                                                    fileName: file.name,
                                                    name: file.name,
                                                    xtype: 'displayfield',
                                                    columnWidth: 0.2,
                                                    hideLabel: true,
                                                    fileType: 'unUpload',
                                                    uploadId: JSGetUUID(),
                                                    value: "<div>" +
                                                        "<div  align='center' style='margin:0px 10px 0px 10px;border: 1px solid #e2e2e4;border-radius:10px;height: auto;height: 150px;' id=" + 'img-' + fieldId + "></div>" +
                                                        "<div align='center'>" + file.name +
                                                        "</div>" +
                                                        "<div align='center'>" +
                                                        "<img title='删除' src='" + deleteImg + "' style='vertical-align: middle;width:16px; height:16px; margin-right:8px;' onclick='deleteFile(\"" + fieldId + "\")'/>" +
                                                        "<img title='查看' src='" + previewImg + "' style='vertical-align: middle;width:16px; height:16px; margin-left:8px;' onclick='preview(\"" + fieldId + "\")'/>" +
                                                        "</div>" +
                                                        "</div>"
                                                });
                                                var img = document.getElementById('img-' + fieldId);
                                                panel.renderedFileCount++;
                                                if (panel.renderedFileCount == filesCount) {
                                                    Array.prototype.push.apply(panel.fileArray, files);//复制文件信息
                                                    panel.fireEvent('allFileRender');
                                                }
                                                img.append(canvas);
                                                console.log(canvas.width + '-' + canvas.height);
                                                if (canvas.width > canvas.height) {
                                                    canvas.style.width = "100%";//以大的一方为约束
                                                } else {
                                                    canvas.style.height = "100%";
                                                }
                                                var renderContext = {
                                                    canvasContext: context,
                                                    viewport: viewport
                                                };
                                                page.render(renderContext);
                                            } else {
                                                panel.renderedFileCount++;
                                                panel.removeFileArr.push(files[index]);
                                                files.splice(index, 1);
                                                if (panel.renderedFileCount == filesCount) {
                                                    Array.prototype.push.apply(panel.fileArray, files);//复制文件信息
                                                    panel.fireEvent('allFileRender');
                                                }
                                            }
                                        });
                                        return;
                                    }
                                }
                            }
                        }
                    },

                    {
                        xtype: 'button',
                        text: i18n.getKey('reset'),
                        iconCls: 'icon_reset',
                        handler: function (btn) {
                            var previewForm = btn.ownerCt.ownerCt;
                            var panel = previewForm.ownerCt;
                            panel.fileArray = [];
                            panel.photoData.files = [];
                            previewForm.removeAll();
                            panel.fireEvent('countChange', {
                                count: 0
                            });
                        }
                    },
                    '->',
                    {
                        xtype: 'displayfield',
                        labelWidth: 30,
                        itemId: 'width',
                        width: 60,
                        fieldLabel: i18n.getKey('width'),
                        value: '<font color="green">' + me.photoData.width + '</font>'
                    },

                    {
                        xtype: 'displayfield',
                        labelWidth: 30,
                        width: 60,
                        margin: '0 40 0 20',
                        itemId: 'height',
                        fieldLabel: i18n.getKey('height'),
                        value: '<font color="green">' + me.photoData.height + '</font>'
                    },
                    {
                        xtype: 'displayfield',
                        labelWidth: 60,
                        itemId: 'currentCount',
                        fieldLabel: i18n.getKey('当前数量'),
                        value: '<font color="green">0</font>'
                    },
                    {
                        xtype: 'displayfield',
                        labelWidth: 60,
                        margin: '0 40 0 20',
                        itemId: 'range',
                        fieldLabel: i18n.getKey('数量限制'),
                        value: '<font color="red">' + me.minCount + (me.maxCount ? '-' + me.maxCount : '') + '</font>'
                    }
                ]
            }
        ];
        me.listeners = {
            countChange: function (argObj) {
                var previewForm = this.getComponent('previewForm');
                var count = previewForm.items.items.length;
                var tbar = previewForm.getDockedItems('toolbar[dock="top"]')[0];
                var range = tbar.getComponent('currentCount');
                var str = '<font color="green">' + count + '</font>';
                range.setValue(str);
            },
            allFileRender: function () {
                var panel = this;
                panel.renderedFileCount = 0;
                // 数量约束提示
                var resultStr = '';
                var currentFieldCount = panel.fileArray.length + panel.photoData.files.length;
                if (panel.removeFileArr.length > 0) {
                    resultStr += '以下文件不符合所需文件大小：<br>'
                    for (var i = 0; i < panel.removeFileArr.length; i++) {
                        resultStr += panel.removeFileArr[i].name + '<br>'
                    }
                    resultStr += '已取消选择<br>'
                }
                if (panel.maxCount && currentFieldCount > panel.maxCount) {
                    resultStr += '已超出允许的最大数量，请在预览中编辑数量';
                }
                if (!panel.maxCount && currentFieldCount > panel.minCount) {
                    resultStr += '已超出允许的最大数量，请在预览中编辑数量'
                }
                if (!Ext.isEmpty(resultStr)) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey(resultStr));
                }
                panel.removeFileArr = [];
                panel.fireEvent('countChange', {count: currentFieldCount});
            },
            afterrender: function () {
                var panel = this;
                var previewForm = panel.getComponent('previewForm');
                for (var i = 0; i < panel.photoData.files.length; i++) {
                    var file = panel.photoData.files[i];
                    var deleteImg = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png';
                    var previewImg = path + 'ClientLibs/extjs/resources/themes/images//shared/fam/preview.png';
                    var fieldId = JSGetUUID();
                    var url = imageServer + file.name.replace('pdf', 'png');
                    var img = null;
                    if (file.width > file.height) {
                        img = "<img  src=" + url + " style='position: relative;top:50%; left:50%;transform:translate(-50%,-50%);width: 100%; cursor: pointer;' onclick='preview(\"" + fieldId + "\"," + file.width + "," + file.height + ")'>";
                    } else {
                        img = "<img  src=" + url + " style='height: 100%; cursor: pointer;' onclick='preview(\"" + fieldId + "\"," + file.width + "," + file.height + ")'>";
                    }
                    previewForm.add({
                        id: fieldId,
                        fileName: file.originalFileName,
                        fileType: 'hadUpload',
                        name: file.originalFileName,
                        xtype: 'displayfield',
                        columnWidth: 0.2,
                        hideLabel: true,
                        fileWidth: file.width,
                        fileHeight: file.height,
                        uploadId: JSGetUUID(),
                        value: "<div>" +
                            "<div  align='center' style='margin:0px 10px 0px 10px;border: 1px solid #e2e2e4;border-radius:10px;height: auto;height: 150px;' id=" + 'img-' + fieldId + ">" +
                            img +
                            "</div>" +
                            "<div align='center'>" + file.originalFileName +
                            "</div>" +
                            "<div align='center'>" +
                            "<img title='删除' src='" + deleteImg + "' style='vertical-align: middle;width:16px; height:16px; margin-right:8px;' onclick='deleteFile(\"" + fieldId + "\")'/>" +
                            "<img title='查看' src='" + previewImg + "' style='vertical-align: middle;width:16px; height:16px; margin-left:8px;' onclick='preview(\"" + fieldId + "\")'/>" +
                            "</div>" +
                            "</div>"
                    });

                }
                panel.fireEvent('countChange', {
                    count: panel.photoData.files.length
                });

            }
        }
        me.callParent();
    }
})
