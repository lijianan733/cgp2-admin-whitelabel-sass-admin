/**
 * Created by nan on 2021/4/22
 */

Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config', {
    statics: {
        componentInfo: {
            'common': ['clazz', 'componentPath', '_id', 'description', 'configId'],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.ToolTipsConfig': ['toolTips'],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.AssistBarConfig': [
                'assistants'
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.UploadDocumentConfig': [
                'readOnly',
                'footerKey',
                'headerKey',
                'descriptionKey',
                'fileNameRegular',//文件名校验规则,该文件名包括文件类型
                'fileAccept',//文件类型约束
                'maxFileSize',//最大上传数量，单位默认为MB
                'templateConfigGroupId',
                'maxColumn',//排布为几行
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.CanvasDocumentConfig': [
                'readOnly', 'footerKey',
                'fitMode', 'zooms',
                'toolPosition', 'showHistory',
                'showMovement', 'showOrder',
                'showOperation', 'elementEditors'

            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.ThreeDDocumentConfig': [
                'readOnly', 'footerKey', '3Dmodel', 'pageScale', 'assets'
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.ImageLibraryConfig': [
                /*'actions',*/
                'titleKey',
                'informationLanguageKey',
                'informationVariable',
                'informationVariableValueEx',
                /*'maxFileSize',*/
                'maxFileSizeUnit',
                'fileExtensions',
                'fileFilters',
                'showOpenLibrary',
                'showAutoFill',
                'fileConfig',
                'imageConfig',//图片信息配置的几个属性
                'showSetBackground',
                'setBackgroundWithColor',//idReference,由showSetBoackground值来控制*/
                'buttons'
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.TextEditorConfig': [
                'elementClazz', 'elementTag', 'sizeMin', 'sizeMax'
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.PhotoEditorConfig': [
                'elementClazz', 'elementTag', 'showRotation',
                'showZoom', 'showFlip', 'showBrightness',
                'brightnessMin', 'brightnessMax', 'filters'
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.RuntimeModelEditorConfig': [
                'showWhenInit', 'autoSubmit', 'model', 'template'
            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.TemplateDownloadConfig': [
                'headerKey',
                'descriptionKey',
                /*  'templateName',
                           该配置受templateName影响
                                'customizeTemplate',

                'downloadStrategy',
                 */
                'templateConfigGroupId'

            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.CommonNavBarConfig': ['commonnavbar'],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.ResourceLibraryConfig': [
                'titleKey',
                'businessLib',
                'eventConfigs',
                'initResources',
                'showSearch',

            ],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.ColorPropertyEditorConfig': ['titleKey','showWhenInit', 'autoSubmit', 'color'],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.FontLibraryConfig': ['titleKey', 'defaultFontSize'],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.BackgroundLibraryConfig': ['titleKey'],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.ColorLibraryConfig': ['titleKey'],
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.QuickPreviewConfig': []
        },
        componentMapping: {
            'ImageLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.ImageLibraryConfig'],
            'ResourceLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.ResourceLibraryConfig'],
            'ToolTips': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.ToolTipsConfig'],
            'AssistBar': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.AssistBarConfig'],
            'RuntimeModelEditor': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.RuntimeModelEditorConfig'],
            'CommonNavBar': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.CommonNavBarConfig'],
            'CanvasDocument': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.CanvasDocumentConfig'],
            'UploadDocument': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.UploadDocumentConfig'],
            'ThreeDDocument': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.ThreeDDocumentConfig'],
            'ColorPropertyEditor': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.ColorPropertyEditorConfig'],
            'TextEditor': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.TextEditorConfig'],
            'PhotoEditor': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.PhotoEditorConfig'],
            'TemplateDownload': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.TemplateDownloadConfig'],
            'FontLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.FontLibraryConfig'],
            'BackgroundLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.BackgroundLibraryConfig'],
            'ColorLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.ColorLibraryConfig'],
            'QuickPreview': ['com.qpp.cgp.domain.product.config.view.builder.config.v3.QuickPreviewConfig']
        },
        elementEditors: [
            {
                clazz: "com.qpp.cgp.domain.product.config.view.builder.config.v3.TextEditorConfig",
                elementClazz: "MultiLineText",
                sizeMax: 200,
                sizeMin: 5,
            },
            {
                brightnessMax: 0.5,
                brightnessMin: -0.5,
                clazz: "com.qpp.cgp.domain.product.config.view.builder.config.v3.PhotoEditorConfig",
                elementClazz: "Picture",
                filters: [{
                    colorCode: null,
                    parameter: null,
                    displayNameKey: "NO_EFFECT"
                },
                    {
                        colorCode: "95AFD4",
                        parameter: "colorFilter=95AFD4",
                        displayNameKey: "BLUE"
                    },
                    {
                        colorCode: "CA7A7D",
                        parameter: "colorFilter=CA7A7D",
                        displayNameKey: "RED"
                    },
                    {
                        colorCode: "94AF7A",
                        parameter: "colorFilter=94AF7A",
                        displayNameKey: "GREEN"
                    },
                    {
                        colorCode: "CA7AAF",
                        parameter: "colorFilter=CA7AAF",
                        displayNameKey: "PINK"
                    },
                    {
                        colorCode: "BE947B",
                        parameter: "colorFilter=BE947B",
                        displayNameKey: "SEPIA"
                    },
                    {
                        colorCode: "000000",
                        parameter: "gray",
                        displayNameKey: "BLACK_WHITE"
                    }],
                showBrightness: true,
                showFlip: true,
                showRotation: true,
                showZoom: true,
            }
        ],
        commonNavBar: {
            itemTemplate: '<div class="navigation-item-index-title"ng-repeat="itemData in ctrl.navRuntimeDatas.${area}_${name}.navItemList"navigation-item item-key="itemData.path"status="itemData.activatedState"><div class="navigation-item-index-title__index"><span class="index-item__left-link"></span><button class="index-item__step-number"ng-bind="$index + 1"></button><span class="index-item__right-link"></span></div><div class="navigation-item-index-title__text"ng-bind="itemData.displayName"ng-title="itemData.displayName"></div></div>',
        },
        //\\192.168.26.200\Share2\cgp_config\RuntimeModelEditorTemplate这数据的来源
        runtimeModelEditor: {
            easyAdvance: '<div class="runtime-Model-Editor__easy-advance"><h2 class="easy-advance__title"translate="EASY_ADVANCE_TITLE"></h2><div class="easy-advance__easy-advanced"><label class="runtime-model-editor_label-btn"ng-class="{\'runtime-model-editor__label-btn_wait\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'type\'].attrOptions[0].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'type\'].attrOptions[0].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'type\'].attrOptions[0],ctrl.runtimeViewModel[\'type\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span"translate="EASY_ADVANCE_EASY"></span></label><label class="runtime-model-editor_label-btn"ng-class="{\'runtime-model-editor__label-btn_wait\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'type\'].attrOptions[1].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'type\'].attrOptions[1].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'type\'].attrOptions[1],ctrl.runtimeViewModel[\'type\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span"translate="EASY_ADVANCE_ADVANCED"></span></label></div><p class="easy-advance__option-describe"ng-show="ctrl.runtimeViewModel[\'type\'].attrOptions[0].isSelected"translate="EASY_ADVANCE_EASY_DESCRIBE"></p><p class="easy-advance__option-describe"ng-show="ctrl.runtimeViewModel[\'type\'].attrOptions[1].isSelected"translate="EASY_ADVANCE_ADVANCED_DESCRIBE"></p></div>',
            qtySameDifferent: '<div class="property-model-editor__container"><div class="property-model-editor__content"><!--qty--><div class="property-model-editor__qty-container"ng-if="ctrl.runtimeViewModel.qty"><div class="property-model-editor__step-container"><b><span translate="STEPTITLE"translate-values="{indexNum:1}"></span></b></div><div class="property-model-editor__qty-content"><p class="property-model-editor__qty-description"><span translate="EDITOR_QTY_TIP"translate-values="{productKey:ctrl.runtimeViewModel.product,propertyValue:ctrl.runtimeViewModel.maxQty.value}"></span></p><input class="step-qty__input"ng-model="ctrl.runtimeViewModel[\'qty\'].value"type="text"placeholder="ctrl.runtimeViewModel[\'maxQty\'].value"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel.qty.value,ctrl.runtimeViewModel.qty)"></div></div><!--front--><div class="property-model-editor__attribute-container"ng-if="ctrl.runtimeViewModel.front"><!--??--><div class="property-model-editor__step-container"><b><span translate="STEPTITLE"translate-values="{indexNum:2}"></span></b></div><p class="property-model-editor__attribute-tip"><span translate="EDITOR_FRONTBACK_TIP_1"></span><b><span translate="EDITOR_FRONTBACK_TIP_FRONT"translate-values="{productKey:ctrl.runtimeViewModel.product}"></span></b></p><div class=""><b><p class="property-model-editor__image-text"translate="EDITOR_IMAGE_TITLE"></p></b><div class="step-operation__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'front\'].attrOptions[0].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'front\'].attrOptions[0].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'front\'].attrOptions[0],ctrl.runtimeViewModel[\'front\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span"translate="RUNTIME_WOOD_FREE"></span></label><span class="step-operation__detail">{{\'EDITOR_IMAGE_OPTION_NAME_1_FRONT\'|translate}}</span></div><div class="step-operation__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'front\'].attrOptions[1].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'front\'].attrOptions[1].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'front\'].attrOptions[1],ctrl.runtimeViewModel[\'front\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span"translate="RUNTIME_C2S"></span></label><span class="step-operation__detail">{{\'EDITOR_IMAGE_OPTION_NAME_2_FRONT\'|translate}}</span></div><!--color--><div ng-if="ctrl.runtimeViewModel.showColorModel"></div></div></div><!--back--><div class="property-model-editor__attribute-container"><div class="property-model-editor__step-container"><b><span translate="STEPTITLE"translate-values="{indexNum:3}"translate-values="{indexNum:ctrl.stepIndex.back}"></span></b></div><p class="property-model-editor__attribute-tip"><span translate="EDITOR_FRONTBACK_TIP_1"></span><b><span translate="EDITOR_FRONTBACK_TIP_BACK"translate-values="{productKey:ctrl.runtimeViewModel.product}"></span></b></p><div class=""><b><p class="property-model-editor__image-text"translate="EDITOR_IMAGE_TITLE"></p></b><div class="step-operation__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'back\'].attrOptions[0].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'back\'].attrOptions[0].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'back\'].attrOptions[0],ctrl.runtimeViewModel[\'back\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span"translate="RUNTIME_WOOD_FREE"></span></label><span class="step-operation__detail">{{\'EDITOR_IMAGE_OPTION_NAME_1_BACK\'|translate}}</span></div><div class="step-operation__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'back\'].attrOptions[1].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'back\'].attrOptions[1].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'back\'].attrOptions[1],ctrl.runtimeViewModel[\'back\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span"translate="RUNTIME_C2S"></span></label><span class="step-operation__detail">{{\'EDITOR_IMAGE_OPTION_NAME_2_BACK\'|translate}}</span></div></div></div><p class="property-model-editor__notice">{{ctrl.runtimeViewModel.noticeKey|translate}}</p></div></div>',
            pokeColor: '<div class="runtime-model-editor__poke-color"><!--第一标题--><h1 class="poke-color__title1"translate="RUNTIME_CHOOSE_CARDS_TITLE"></h1><!--第二标题--><h3 class="poke-color__title2">{{\'RUNTIME_CHOOSE_ADD\'|translate}}<span class="poke-color__title2-sp">({{\'RUNTIME_NO_IMAGE2\'|translate}})</span></h3><!--提示标题--><div class="poke-color__select-detail"translate="RUNTIME_SELECT_NUM_MESSAGES"></div><!--主体-选择容器--><div class="poke-color__select-container"><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'runtime-model-editor__label-btn_wait\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'color\'].attrOptions[0].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'color\'].attrOptions[0].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'color\'].attrOptions[0],ctrl.runtimeViewModel[\'color\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">1{{\'RUNTIME_MSG\'|translate}}</span></label><span class="select-container__message-detail"translate="RUNTIME_SAME_MSG_DECK"></span></div><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'runtime-model-editor__label-btn_wait\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'color\'].attrOptions[1].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'color\'].attrOptions[1].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'color\'].attrOptions[1],ctrl.runtimeViewModel[\'color\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">4{{\'RUNTIME_MSG\'|translate}}</span></label><div><span translate="RUNTIME_SAME_MSG_SUIT"></span><div class="select-container__message-img-box">(<div class="select-container__insert-img"></div>)</div></div></div><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'runtime-model-editor__label-btn_wait\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'color\'].attrOptions[2].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'color\'].attrOptions[2].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'color\'].attrOptions[2],ctrl.runtimeViewModel[\'color\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">13{{\'RUNTIME_MSG\'|translate}}</span></label><div><span translate="RUNTIME_SAME_MSG_NUMBER"></span><br><span translate="RUNTIME_POKER_NUM"></span></div></div><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'runtime-model-editor__label-btn_wait\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'color\'].attrOptions[3].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'color\'].attrOptions[3].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'color\'].attrOptions[3],ctrl.runtimeViewModel[\'color\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">54{{\'RUNTIME_MSG\'|translate}}</span></label><span translate="RUNTIME_DIFF_MSG_CARD"></span></div></div></div>',
            pokeImage: '<div class="runtime-model-editor__poke-image"><!--第一标题--><h1 class="poke-image__title1"translate="RUNTIME_CHOOSE_CARDS_TITLE"></h1><!--第二标题--><h3 class="poke-image__title2">{{\'RUNTIME_UPLOAD_ADD\'|translate}}</h3><!--提示标题--><div class="poke-image__select-detail"translate="RUNTIME_SELECT_NUM_IMAGES"></div><!--主体-选择容器--><div class="poke-image__select-container"><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'image\'].attrOptions[0].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'image\'].attrOptions[0].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'image\'].attrOptions[0],ctrl.runtimeViewModel[\'image\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">1{{\'RUNTIME_IMG\'|translate}}</span></label><span class="select-container__message-detail"translate="RUNTIME_SAME_IMG_DECK"></span></div><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'image\'].attrOptions[1].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'image\'].attrOptions[1].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'image\'].attrOptions[1],ctrl.runtimeViewModel[\'image\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">4{{\'RUNTIME_IMG\'|translate}}</span></label><div><span translate="RUNTIME_SAME_IMG_SUIT"></span><div class="select-container__message-img-box">(<div class="select-container__insert-img"></div>)</div></div></div><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'image\'].attrOptions[2].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'image\'].attrOptions[2].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'image\'].attrOptions[2],ctrl.runtimeViewModel[\'image\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">13{{\'RUNTIME_IMG\'|translate}}</span></label><div><span translate="RUNTIME_SAME_IMG_NUMBER"></span><br><span translate="RUNTIME_POKER_NUM"></span></div></div><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'image\'].attrOptions[3].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'image\'].attrOptions[3].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'image\'].attrOptions[3],ctrl.runtimeViewModel[\'image\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">54{{\'RUNTIME_IMG\'|translate}}</span></label><span translate="RUNTIME_DIFF_IMG_CARD"></span></div></div></div>',
            pokeImageText: '<div class="runtime-model-editor__poke-image-text"><!--第一标题--><h1 class="poke-image-text__title1"translate="RUNTIME_CHOOSE_BACK"></h1><div class="poke-image-text__body"><!--第二标题--><h3 class="poke-image-text__title2"translate="RUNTIME_UPLOAD_ADD"></h3><!--提示标题--><div class="poke-image-text__select-detail"translate="RUNTIME_SELECT_NUM_IMAGES"></div><!--主体-选择容器-左--><div class="poke-image-text__select-container-left"><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'imageText\'].attrOptions[0].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'imageText\'].attrOptions[0].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'imageText\'].attrOptions[0],ctrl.runtimeViewModel[\'imageText\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">1{{\'RUNTIME_IMG\'|translate}}</span></label><span class="select-container__message-detail"translate="RUNTIME_SAME_IMG_DECK"></span></div><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'imageText\'].attrOptions[1].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'imageText\'].attrOptions[1].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'imageText\'].attrOptions[1],ctrl.runtimeViewModel[\'imageText\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">4{{\'RUNTIME_IMG\'|translate}}</span></label><div><span class="select-container__message-detail"translate="RUNTIME_SAME_IMG_SUIT"></span><div class="select-container__message-img-box">(<div class="select-container__insert-img"></div>)</div></div></div><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'imageText\'].attrOptions[2].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'imageText\'].attrOptions[2].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'imageText\'].attrOptions[2],ctrl.runtimeViewModel[\'imageText\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">13{{\'RUNTIME_IMG\'|translate}}</span></label><div><span class="select-container__message-detail"translate="RUNTIME_SAME_IMG_NUMBER"></span><br><span class="select-container__message-detail"translate="RUNTIME_POKER_NUM"></span></div></div><div class="select-container__message"><!--按钮选中状态样式runtime-model-editor__label-btn_checked--><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'imageText\'].attrOptions[3].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'imageText\'].attrOptions[3].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'imageText\'].attrOptions[3],ctrl.runtimeViewModel[\'imageText\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">54{{\'RUNTIME_IMG\'|translate}}</span></label><span class="select-container__message-detail"translate="RUNTIME_DIFF_IMG_CARD"></span></div></div></div><div class="poke-image-text__body"><!--第二标题--><h3 class="poke-image-text__title2">{{\'RUNTIME_CHOOSE_ADD\'|translate}}<span class="poke-image-text__title2-sp">({{\'RUNTIME_NO_IMAGE2\'|translate}})</span></h3><!--提示标题--><div class="poke-image-text__select-detail"translate="RUNTIME_SELECT_NUM_MESSAGES"></div><!--主体-选择容器--><div class="poke-image-text__select-container-right"><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'colorText\'].attrOptions[0].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'colorText\'].attrOptions[0].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'colorText\'].attrOptions[0],ctrl.runtimeViewModel[\'colorText\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">1{{\'RUNTIME_MSG\'|translate}}</span></label><span class="select-container__message-detail"translate="RUNTIME_SAME_MSG_DECK"></span></div><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'colorText\'].attrOptions[1].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'colorText\'].attrOptions[1].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'colorText\'].attrOptions[1],ctrl.runtimeViewModel[\'colorText\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">4{{\'RUNTIME_MSG\'|translate}}</span></label><div><span translate="RUNTIME_SAME_MSG_SUIT"></span><div class="select-container__message-img-box">(<div class="select-container__insert-img"></div>)</div></div></div><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'colorText\'].attrOptions[2].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'colorText\'].attrOptions[2].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'colorText\'].attrOptions[2],ctrl.runtimeViewModel[\'colorText\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">13{{\'RUNTIME_MSG\'|translate}}</span></label><div><span translate="RUNTIME_SAME_MSG_NUMBER"></span><br><span translate="RUNTIME_POKER_NUM"></span></div></div><div class="select-container__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'colorText\'].attrOptions[3].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'colorText\'].attrOptions[3].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'colorText\'].attrOptions[3],ctrl.runtimeViewModel[\'colorText\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span">54{{\'RUNTIME_MSG\'|translate}}</span></label><span translate="RUNTIME_DIFF_MSG_CARD"></span></div></div></div></div>',
            pokeSameDifferent: '<div class="runtime-Model-Editor__qty-same-difft-fronts"><div class="qty-same-difft-fronts__step1"><h3 class="qty-same-difft-fronts__title">{{\'RUNTIME_STEP1\'|translate}}:</h3><div class="qty-same-difft-fronts__step1-qty"><!--TODO数据绑定的层级结构待确认--><span class="step1-qty__detail"translate="RUNTIME_QTY_DETAIL"translate-values="{maxQty:ctrl.runtimeViewModel[\'maxQty\'].value}"></span><!--TODO ng-model="ctrl.runtimeViewModel[\'qty\'].value"(待确认)--><input class="step1-qty__input"ng-model="ctrl.runtimeViewModel[\'qty\'].value"type="text"placeholder="ctrl.runtimeViewModel[\'maxQty\'].value"></div><div class="qty-same-difft-fronts__step1-operation-packaging"><div class="qty-same-difft-fronts__step1-change"><button class="step1-change__btn"translate="RUNTIME_CHANGE"></button><select class="step1-change__select"name=""id=""><!--TODO多语言配置待核对，之后确认是否添加--><option value="">Up to 55 cards</option><option value="">Up to 18 cards</option></select></div><div class="qty-same-difft-fronts__step1-packaging"><label class="step1-packaging__name">{{\'RUNTIME_PACKAGING\'|translate}}:</label><!--TODO数据结构不清晰，待完善ng-repeat="item in ctrl.runtimeViewModel[\'packaging\']"--><select class="step1-Packaging__select"name=""id=""><!--<option value=""></option>--><option value="">Shrink-wrapped</option><option value="">Plain black velvet bag</option></select></div></div></div><div class="qty-same-difft-fronts__step2"><h3 class="qty-same-difft-fronts__title">{{\'RUNTIME_STEP2\'|translate}}:</h3><p class="step2__detail">{{\'RUNTIME_CHOOSE_YOU_WANT\'|translate}}<span class="step2__detail-bold"translate="RUNTIME_CARD_FRONTS"></span>:</p><div class="qty-same-difft-fronts__step2-operation"><div class="step2-operation__image-text"><h3 class="step2-operation__title"translate="RUNTIME_IMAGE_TEXT"></h3><div class="step2-operation__same-image"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'image\'].attrOptions[0].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'image\'].attrOptions[0].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'image\'].attrOptions[0],ctrl.runtimeViewModel[\'image\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span"translate="RUNTIME_SAME_IMAGE"></span></label><span class="step2-operation__detail">{{\'RUNTIME_SAME_ALL_FRONTS\'|translate}}</span></div><div class="step2-operation__dift-image"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'image\'].attrOptions[1].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'image\'].attrOptions[1].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'image\'].attrOptions[1],ctrl.runtimeViewModel[\'image\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span"translate="RUNTIME_DIFFT_IMAGE"></span></label><span class="step2-operation__detail">{{\'RUNTIME_DIFFT_FOR_FRONTS\'|translate}}</span></div></div><div class="step2-operation__colorBkd-text"><h3 class="step2-operation__title">{{\'RUNTIME_COLOR_BGD_TEXT\'|translate}}</h3><div class="step2-operation__same-message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'color\'].attrOptions[0].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'color\'].attrOptions[0].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'color\'].attrOptions[0],ctrl.runtimeViewModel[\'color\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span"translate="RUNTIME_SAME_MESSAGE"></span></label><span class="step2-operation__detail">{{\'RUNTIME_SAME_MESSAGE_FOR_FRONTS\'|translate}}</span></div><div class="step2-operation__dift-message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'color\'].attrOptions[1].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'color\'].attrOptions[1].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'color\'].attrOptions[1],ctrl.runtimeViewModel[\'color\'])"ng-disabled="ctrl.isChanging"><span class="label-btn__span"translate="RUNTIME_DIFFT_MESSAGE"></span></label><span class="step2-operation__detail">{{\'RUNTIME_DIFFT_MESSAGE_FRONTS\'|translate}}</span></div></div></div></div></div>',
            calendarDetail: '<div class="runtime-Model-Editor__calendar-detail"><p class="calendar-detail__title"translate="CALENDAR_DETAIL_TITLE_CHANGE"></p><div class="calendar-detail__container"><div class="calendar-detail__month-start"><p translate="CALENDAR_DETAIL_TITLE_MONTH_START"></p><qp-date relate-attribute="{skuAttributeId:ctrl.runtimeViewModel.startMonth.skuAttributeId,groupId:ctrl.runtimeViewModel.startMonth.groupId}"date-config="{currentDate:ctrl.runtimeViewModel.startMonth.value,startDate:ctrl.runtimeViewModel.startMonth.value}"></qp-date></div><div class="calendar-detail__month-number"><p translate="CALENDAR_DETAIL_TITLE_NUMBER_OF_MONTH"></p><label class="runtime-model-editor_label-btn"><input class="label-btn__radio-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'monthNumber\'].attrOptions[0].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'monthNumber\'].attrOptions[0],ctrl.runtimeViewModel[\'monthNumber\'])"><span class="label-btn__span"translate="CALENDAR_DETAIL_MONTH_NUMBER_12"></span></label><br><label class="runtime-model-editor_label-btn"><input class="label-btn__radio-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'monthNumber\'].attrOptions[1].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'monthNumber\'].attrOptions[1],ctrl.runtimeViewModel[\'monthNumber\'])"><span class="label-btn__span"translate="CALENDAR_DETAIL_MONTH_NUMBER_18"></span></label></div><p class="calendar-detail__option-note"translate="CALENDAR_DETAIL_NOTE"></p></div></div>',
            deskCalendaryDetail: '<div class="runtime-Model-Editor__calendar-detail"><p class="calendar-detail__title"translate="CALENDAR_DETAIL_TITLE_CHANGE"></p><div class="calendar-detail__container"><div class="calendar-detail__month-start"><p translate="CALENDAR_DETAIL_TITLE_MONTH_START"></p><qp-date relate-attribute="{skuAttributeId:ctrl.runtimeViewModel.startMonth.skuAttributeId,groupId:ctrl.runtimeViewModel.startMonth.groupId}"date-config="{currentDate:ctrl.runtimeViewModel.startMonth.value,startDate:ctrl.runtimeViewModel.startMonth.value}"></qp-date></div><p class="calendar-detail__option-note"translate="CALENDAR_DETAIL_NOTE"></p></div></div>',
            sameDifferent: '<div class="property-model-editor__container"><div class="property-model-editor__content"><!--front--><div class="property-model-editor__attribute-container"ng-if="ctrl.runtimeViewModel.front"><div class="property-model-editor__step-container"><b><span translate="STEPTITLE"translate-values="{indexNum:1}"></span></b></div><p class="property-model-editor__attribute-tip"><span translate="EDITOR_FRONTBACK_TIP_1"></span><b><span translate="EDITOR_FRONTBACK_TIP_FRONT"translate-values="{productKey:ctrl.runtimeViewModel.product}"></span></b></p><div><b><p class="property-model-editor__image-text"translate="EDITOR_IMAGE_TITLE"></p></b><div class="step-operation__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'front\'].attrOptions[0].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'front\'].attrOptions[0].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'front\'].attrOptions[0],ctrl.runtimeViewModel[\'front\'])"ng-disabled="ctrl.isChanging"><span translate="RUNTIME_SAME_IMAGE"></span></label><span class="step-operation__detail"><span class="first-word">{{\'EDITOR_IMAGE_OPTION_NAME_1_FRONT_FIRST_WORD\'|translate}}</span>{{\'EDITOR_IMAGE_OPTION_NAME_1_FRONT\'|translate}}</span></div><div class="step-operation__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'front\'].attrOptions[1].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'front\'].attrOptions[1].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'front\'].attrOptions[1],ctrl.runtimeViewModel[\'front\'])"ng-disabled="ctrl.isChanging"><span translate="RUNTIME_DIFFT_IMAGE"></span></label><span class="step-operation__detail"><span class="first-word">{{\'EDITOR_IMAGE_OPTION_NAME_2_FRONT_FIRST_WORD\'|translate}}</span>{{\'EDITOR_IMAGE_OPTION_NAME_2_FRONT\'|translate}}</span></div><!--color--><div ng-if="ctrl.runtimeViewModel.showColorModel"></div></div></div><!--back--><div class="property-model-editor__attribute-container"><div class="property-model-editor__step-container"><b><span translate="STEPTITLE"translate-values="{indexNum:2}"translate-values="{indexNum:ctrl.stepIndex.back}"></span></b></div><p class="property-model-editor__attribute-tip"><span translate="EDITOR_FRONTBACK_TIP_1"></span><b><span translate="EDITOR_FRONTBACK_TIP_BACK"translate-values="{productKey:ctrl.runtimeViewModel.product}"></span></b></p><div><b><p class="property-model-editor__image-text"translate="EDITOR_IMAGE_TITLE"></p></b><div class="step-operation__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'back\'].attrOptions[0].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'back\'].attrOptions[0].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'back\'].attrOptions[0],ctrl.runtimeViewModel[\'back\'])"ng-disabled="ctrl.isChanging"><span translate="RUNTIME_SAME_IMAGE"></span></label><span class="step-operation__detail"><span class="first-word">{{\'EDITOR_IMAGE_OPTION_NAME_1_BACK_FIRST_WORD\'|translate}}</span>{{\'EDITOR_IMAGE_OPTION_NAME_1_BACK\'|translate}}</span></div><div class="step-operation__message"><label class="runtime-model-editor_label-btn"ng-class="{\'model-editor__widget-wait-label\':ctrl.isChanging,\'runtime-model-editor__label-btn_checked\':ctrl.runtimeViewModel[\'back\'].attrOptions[1].isSelected}"><input class="label-btn__ckx-ipt"type="checkbox"ng-model="ctrl.runtimeViewModel[\'back\'].attrOptions[1].isSelected"ng-change="ctrl.attributeChange(ctrl.runtimeViewModel[\'back\'].attrOptions[1],ctrl.runtimeViewModel[\'back\'])"ng-disabled="ctrl.isChanging"><span translate="RUNTIME_DIFFT_IMAGE"></span></label><span class="step-operation__detail"><span class="first-word">{{\'EDITOR_IMAGE_OPTION_NAME_2_BACK_FIRST_WORD\'|translate}}</span>{{\'EDITOR_IMAGE_OPTION_NAME_2_BACK\'|translate}}</span></div></div></div><p class="property-model-editor__notice">{{ctrl.runtimeViewModel.noticeKey|translate}}</p></div></div>',
        },
        /**
         * 组件的默认初始化值
         */
        componentDefaultConfig2: {
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.ToolTipsConfig': {
                toolTips: ["supportIntroduce", "cutlineIntroduce", "imgIntroduce"],
            },
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.AssistBarConfig': {},
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.UploadDocumentConfig': {
                maxFileSize: 512,
                maxColumn: 3
            },
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.CanvasDocumentConfig': {
                fitMode: 'fitPage',
                zooms: [25, 50, 100, 200, 400],
                toolPosition: 'Bottom',
                showHistory: true,
                showMovement: true,
                showOrder: true,
                showOperation: true,
                elementEditors: [
                    {
                        clazz: "com.qpp.cgp.domain.product.config.view.builder.config.v3.TextEditorConfig",
                        elementClazz: "MultiLineText",
                        sizeMax: 200,
                        sizeMin: 5,
                    },
                    {
                        brightnessMax: 0.5,
                        brightnessMin: -0.5,
                        clazz: "com.qpp.cgp.domain.product.config.view.builder.config.v3.PhotoEditorConfig",
                        elementClazz: "Picture",
                        filters: [{
                            colorCode: null,
                            parameter: null,
                            displayNameKey: "NO_EFFECT"
                        },
                            {
                                colorCode: "95AFD4",
                                parameter: "colorFilter=95AFD4",
                                displayNameKey: "BLUE"
                            },
                            {
                                colorCode: "CA7A7D",
                                parameter: "colorFilter=CA7A7D",
                                displayNameKey: "RED"
                            },
                            {
                                colorCode: "94AF7A",
                                parameter: "colorFilter=94AF7A",
                                displayNameKey: "GREEN"
                            },
                            {
                                colorCode: "CA7AAF",
                                parameter: "colorFilter=CA7AAF",
                                displayNameKey: "PINK"
                            },
                            {
                                colorCode: "BE947B",
                                parameter: "colorFilter=BE947B",
                                displayNameKey: "SEPIA"
                            },
                            {
                                colorCode: "000000",
                                parameter: "gray",
                                displayNameKey: "BLACK_WHITE"
                            }],
                        showBrightness: true,
                        showFlip: true,
                        showRotation: true,
                        showZoom: true,
                    }
                ]
            },
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.ThreeDDocumentConfig': {},
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.ImageLibraryConfig': {
                //这是默认数据
                informationVariable: {
                    format: 'jpg, jpeg, bmp, png, gif',
                    dpi: 300,
                    maxFileSize: 300,
                    maxFileSizeUnit: 'MB'
                },
                maxFileSize: 300,
                maxFileSizeUnit: "MB",
                fileExtensions: "jpg,jpeg,bmp,png,gif",
                fileFilters: "image/jpg,image/jpeg,image/bmp,image/png,image/gif,image/tif,image/tiff",
                informationLanguageKey: "FILE_TYPES_ACCEPTED",
                showAutoFill: true,
                showOpenLibrary: true,
                titleKey: "ImageLibraryTitleKey"
            },
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.TextEditorConfig': {
                elementClazz: 'MultiLineText',
                sizeMin: 5,
                sizeMax: 200
            },
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.PhotoEditorConfig': {
                elementClazz: 'Picture',
                showRotation: true,
                showZoom: true,
                showFlip: true,
                showBrightness: true,
                brightnessMin: -0.5,
                brightnessMax: 0.5,
                filters: [
                    {
                        colorCode: null,
                        parameter: null,
                        displayNameKey: "NO_EFFECT"
                    },
                    {
                        colorCode: "95AFD4",
                        parameter: "colorFilter=95AFD4",
                        displayNameKey: "BLUE"
                    },
                    {
                        colorCode: "CA7A7D",
                        parameter: "colorFilter=CA7A7D",
                        displayNameKey: "RED"
                    },
                    {
                        colorCode: "94AF7A",
                        parameter: "colorFilter=94AF7A",
                        displayNameKey: "GREEN"
                    },
                    {
                        colorCode: "CA7AAF",
                        parameter: "colorFilter=CA7AAF",
                        displayNameKey: "PINK"
                    },
                    {
                        colorCode: "BE947B",
                        parameter: "colorFilter=BE947B",
                        displayNameKey: "SEPIA"
                    },
                    {
                        colorCode: "000000",
                        parameter: "gray",
                        displayNameKey: "BLACK_WHITE"
                    }
                ]
            },
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.RuntimeModelEditorConfig': {},
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.TemplateDownloadConfig': {
                downloadStrategy: "detail",
            },
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.CommonNavBarConfig': {
                showWizard: true,
                pageSize: 1,
                showFirstAndLast: true,
            },
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.ResourceLibraryConfig': {},
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.ColorPropertyEditorConfig': {
                showWhenInit: false,
                autoSubmit: false
            },
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.FontLibraryConfig': {},
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.BackgroundLibraryConfig': {},
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.ColorLibraryConfig': {},
            'com.qpp.cgp.domain.product.config.view.builder.config.v3.QuickPreviewConfig': {}
        },
        resource: {
            'defaultFontSize': 'defaultFontSize',
            'eventConfigs': 'eventConfigs',
            "showSearch": 'showSearch',
            "filePath": "filePath",
            "jsonPath": "jsonPath",
            "name": "名称",
            "product": "产品",
            "qty": "数量",
            "expandAll": "展开",
            "refresh": "刷新",
            "component": "组件",
            "manager": "管理",
            "valueType": "值类型",
            "selectType": "值输入方式",
            "select": "选择",
            "path": "路径",
            "editViewType": "editViewType",
            "id": "编号",
            "description": "描述",
            "noData": "没有数据！",
            "check": "查看",
            "config": "配置",
            "save": "保存",
            "type": "类型",
            "titleKey": "titleKey",
            "提示信息配置": "提示信息配置",
            "information LanguageKey": "information LanguageKey",
            "information Variable": "information Variable",
            "information VariableValueEx": "information VariableValueEx",
            "key": "键名",
            "value": "值",
            "readOnly": "只读",
            "文件上传配置": "文件上传配置",
            "maxFileSize": "文件最大值",
            "maxFileSizeUnit": "文件单位",
            "fileExtensions": "fileExtensions",
            "fileFilters": "文件接收类型",
            "showOpenLibrary": '"打开图库"是否显示',
            "showAutoFill": '"自动填充"是否显示',
            '"设置为背景"是否显示': '"设置为背景"是否显示',
            "背景遮盖颜色": "背景遮盖颜色",
            "color": "颜色",
            "code": "代码",
            "显示颜色": "显示颜色",
            "提示信息列表": "提示信息列表",
            "supportIntroduce": "语言提示框",
            "fontIntroduce": "字体介绍提示框",
            "cutlineIntroduce": "图片安全区域介绍弹框",
            "imgIntroduce": "图片上传步骤弹框",
            "内嵌组件列表": "内嵌组件列表",
            "column": "column",
            "适应模式": "适应模式",
            "3D模型数据": "3D模型数据",
            "放大倍数": "放大倍数",
            "模型配置数据": "模型配置数据",
            "材质名": "材质名",
            "condition": "条件",
            "pcIndex": "pcIndex",
            "image": "图片",
            "是否使用透明材质": "是否使用透明材质",
            "定制内容": "定制内容",
            "固定内容": "固定内容",
            "初始化后显示": "初始化后显示",
            "自动提交": "自动提交",
            "template": "模板",
            "导入模板数据": "导入模板数据",
            "resources": "资源",
            "font": "字体",
            "background": "背景图库",
            "目标元素类型": "目标元素类型",
            "目标元素标签": "目标元素标签",
            "字体大小最小值": "字体大小最小值",
            "字体大小最大值": "字体大小最大值",
            "启用旋转": "启用旋转",
            "启用缩放": "启用缩放",
            "启用翻转": "启用翻转",
            "启用明亮度": "启用明亮度",
            "明亮度最小值": "明亮度最小值",
            "明亮度最大值": "明亮度最大值",
            "滤镜": "滤镜",
            "displayNameKey": "displayNameKey",
            "colorCode": "colorCode",
            "parameter": "parameter",
            "缩放比例可选值(%)": "缩放比例可选值(%)",
            "工具栏位置": "工具栏位置",
            "顶部": "顶部",
            "底部": "底部",
            "左侧": "左侧",
            "右侧": "右侧",
            "显示‘撤销/恢复’按钮": "显示‘撤销/恢复’按钮",
            "显示‘对齐方式’按钮": "显示‘对齐方式’按钮",
            "显示‘调整顺序’按钮": "显示‘调整顺序’按钮",
            "显示‘编辑’按钮": "显示‘编辑’按钮",
            "elementEditors": "elementEditors",
            "headerKey": "headerKey",
            "descriptionKey": "descriptionKey",
            "footerKey": "页脚",
            "文件类型": "文件类型",
            "文件名正则匹配规则": "文件名正则匹配规则",
            "最大文件大小(MB)": "最大文件大小(MB)",
            "maxColumn": "最大列数",
            "templateConfig GroupId": "templateConfig GroupId",
            "navigation": "导航",
            "序号+文字": "序号+文字",
            "图片+文字": "图片+文字",
            "分页": "分页",
            "通用": "通用",
            "配置模式": "配置模式",
            "复杂": "复杂",
            "简单": "简单",
            "启用导航按钮": "启用导航按钮",
            "导航项模板": "导航项模板",
            "显示方式": "显示方式",
            "横向格子列表": "横向格子列表",
            "下拉列表": "下拉列表",
            "一直显示分页按钮": "一直显示分页按钮",
            "每页显示导航项数量": "每页显示导航项数量",
            "显示’第一页‘和’最后一页‘按钮": "显示’第一页‘和’最后一页‘按钮",
            "‘第一页’按钮模板": "‘第一页’按钮模板",
            "‘上一页’按钮模板": "‘上一页’按钮模板",
            "‘下一页’按钮模板": "‘下一页’按钮模板",
            "‘最后一页’按钮模板": "‘最后一页’按钮模板",
            "add": "添加",
            "node": "节点",
            "数据导入": "数据导入",
            "自定义": "自定义",
            "groupId": "分组Id",
            "pmvt/smvt": "pmvt/smvt",
            "materialPath": "物料路径",
            "下载的文件": "下载的文件",
            "fitMode": "适应模式",
            "title": "标题",
            "info": "信息",
            "displayName": "显示名称",
            "prompt": "提示",
            "autoSize": "自适应内容大小",
            "stretchSize": "自适应屏幕大小",
            "fixSize": "固定大小",
            "width": "宽",
            "height": "高",
            "buttons": 'buttons'
        },
        testData: [
            {
                "id": 18272724,
                "componentPath": {
                    "clazz": "com.qpp.cgp.domain.product.config.view.builder.config.v3.FullPath",
                    "path": "$.areas[?(@.position.layoutPosition=='Bottom')].components[?(@.name=='nantest')]"
                },
                "clazz": "com.qpp.cgp.domain.product.config.view.builder.config.v3.BackgroundLibraryConfig"
            },
            {
                "id": 18280063,
                "componentPath": {
                    "clazz": "com.qpp.cgp.domain.product.config.view.builder.config.v3.FullPath",
                    "path": "$.areas[?(@.position.layoutPosition=='DocumentView')].components[?(@.name=='DocumentComponent')]"
                },
                "clazz": "com.qpp.cgp.domain.product.config.view.builder.config.v3.MultiViewUploadEditBoardConfig",
                "scrollY": false
            },
            {
                "id": 18282773,
                "componentPath": {
                    "clazz": "com.qpp.cgp.domain.product.config.view.builder.config.v3.FullPath",
                    "path": "$.areas[?(@.position.layoutPosition=='Left')].components[?(@.name=='ThreeDPreviewBoard')]"
                },
                "clazz": "com.qpp.cgp.domain.product.config.view.builder.config.v3.ThreeDPreviewBoardConfig",
                "model": {
                    "_id": "17181717",
                    "clazz": "com.qpp.cgp.domain.product.config.model.ThreeDModelConfig",
                    "multilingualKey": "com.qpp.cgp.domain.product.config.model.ThreeDModelConfig"
                },
                "assets": [
                    {
                        "name": "123",
                        "type": "Dynamic",
                        "imageName": "21321",
                        "description": "123",
                        "useTransparentMaterial": false
                    }
                ],
                "pageScale": 1
            }
        ],
        testData2: [
            {"clazz": "com.qpp.cgp.domain.product.config.view.builder.config.v3.BackgroundLibraryConfig"},
            {
                "clazz": "com.qpp.cgp.domain.product.config.view.builder.config.v3.MultiViewUploadEditBoardConfig",
                "scrollY": false
            }, {
                "clazz": "com.qpp.cgp.domain.product.config.view.builder.config.v3.ThreeDPreviewBoardConfig",
                "model": {
                    "clazz": "com.qpp.cgp.domain.product.config.model.ThreeDModelConfig",
                    "multilingualKey": "com.qpp.cgp.domain.product.config.model.ThreeDModelConfig",
                    "_id": "17181717"
                },
                "pageScale": 1,
                "assets": [{
                    "name": "123",
                    "pcIndex": null,
                    "description": "123",
                    "useTransparentMaterial": false,
                    "condition": null,
                    "conditionDTO": null,
                    "type": "Dynamic",
                    "imageName": "21321"
                }]
            }, {
                "clazz": "com.qpp.cgp.domain.product.config.view.builder.config.v3.H1NavBarConfig",
                "enableNavButton": true
            }]
    }
})
