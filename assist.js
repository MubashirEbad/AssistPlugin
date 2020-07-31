"use strict";

var showWidget = false;
var keyboardNavigation = false;
var readPage = 0;
var contrast = 0;
var defaultElementsStyles = [];
var highlighLinks = false;
var defaultLinksStyles = [];
var fontSize = 0;
var letterSpacing = 0;
var cursorOption = 0;
var defaultElementsCursors = [];
var legibleFonts = 0;
var showPageStructure = false;
var fetchAllHeadingsFlag = false;
var fetchAllLinksFlag = false;

var pageStructureTab = 0;
var widgetEnabled = 0;
var hideUnhide = false;

var selectedPosition = 2;

var widgetHideUnhide = '';

const available_voices = window.speechSynthesis.getVoices();
var english_voice = '';

var utter = new SpeechSynthesisUtterance();

! function setVoice() {
    for (var i = 0; i < available_voices.length; i++) {
        if (available_voices[i].lang === 'en-US') {
            english_voice = available_voices[i];
            break;
        }
    }
    if (english_voice === '') {
        english_voice = available_voices[0];
    }
    window.speechSynthesis.cancel();
}();

! function init() {
    const mainWidget = `
    <html>
    <body>
    <style>
    .modal {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
        visibility: hidden;
        transform: scale(1.1);
        transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
    }
    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        height: 650px;
        width: 600px;
        border-radius: 0.5rem;
    }
    .close-button {
        cursor: pointer;
        font-size: 30px;
        color: #ffffff;
        margin-top: -5px;
    }
    .show-modal {
        z-index: 1;
        opacity: 1;
        visibility: visible;
        transform: scale(1.0);
        transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
    }
    </style>
        <div id='widget-window-cursor'
        style='display: none; background: #000; min-width: 100% !important; position: absolute!important; height: 12px!important; border: solid 3px #fff300; border-radius: 5px; z-index: 2147483647;'>
        </div>
        <div id='widget-window'
        style='margin-top: 50px; position: fixed; z-index: 10001; display: flex; justify-content: flex-end; font-family: sans-serif; right: 2px;'>
            <div id='widget-main-div-both-container' style='display: flex; flex-direction: row-reverse'>
                <div id="main-widget-container-move" style="margin-top: 10px; user-select: none; display: none; height: 600px; width: 350px; background-color: #fdfcfc; border-radius: 10px; border: 1px solid #d4d4d4;">
                    <div id="option-header-move" style="display: flex; align-items: center; width: 100%; height: 60px; border-radius: 10px 10px 0px 0px; background: linear-gradient(to right, #43146deb, #4a1579fa, #43146d) !important;">
                        <div id="option-header-move" style="display: flex; width: calc(100% - 40px); margin-left: 20px; color: white;">
                            <p id="para-1" style="margin: 0; font-family: 'Metropolis';">Move Widget </p>
                            <p id="para-1" style="cursor: pointer; margin: 0; margin-left: auto; font-family: 'Metropolis';" onclick="toggleWidget()">Close</p>
                        </div>
                    </div>
                    <div 
                    id='widget-window-container'
                    style='width: calc(100% - 40px); height: 170px; margin-top: 20px; margin-left: 20px;'>
                        <p id='para-1' style='color: #697480; !important; margin: 0; font-family: "Metropolis"'> The Assist accessibility widget provides helpful accessibility tools and site modification options for users requiring accessibility enhancements. You can temporarily move. A permanent change of position can only be made by the site admin through the admin menu. </p>
                    </div>
                    <div id='widget-move-options-container' style='display: flex; position: relative; width: 100%; justify-content: center; height: 200px;'>
                        <img id='widget-move-options-container' src="https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/screen-icon.png" style="height: 200px;" />
                        <div id='widget-move-options-container' style='display: flex; position: absolute; width: 100%; height: 50px; justify-content: space-between'>
                            <input onchange='onChangeMoveOption(event)' value='widget-option-top-left' name='widget-option-radio-button' id='widget-option-radio-button' type='radio' style='font-size: 30px; margin-top: 17px; margin-left: 50px;' />
                            <input onchange='onChangeMoveOption(event)' value='widget-option-top-right' name='widget-option-radio-button' id='widget-option-radio-button' type='radio' checked style='font-size: 30px; margin-right: 50px; margin-top: 17px;' />
                        </div>
                        <div id='widget-move-options-container' style='display: flex; position: absolute; width: 100%; height: 100px; justify-content: space-between; margin-top: 50px;'>
                            <input onchange='onChangeMoveOption(event)' value='widget-option-bottom-left' name='widget-option-radio-button' id='widget-option-radio-button' type='radio' style='font-size: 30px; margin-top: 87px; margin-left: 50px;' />
                            <input onchange='onChangeMoveOption(event)' value='widget-option-bottom-right' name='widget-option-radio-button' id='widget-option-radio-button' type='radio' style='font-size: 30px; margin-right: 50px; margin-top: 87px;' />
                        </div>
                    </div>
                    <div id='widget-move-options-container' style='display: flex; width: 100%; justify-content: center; margin-top: 30px;'>
                        <button
                        id='widget-option-move-cancel'
                        onclick='onClickOption10("cancel")'
                        style='width: 120px; border: 1px solid #006dd5; background: #fff; line-height: 38px; text-align: center; color: #006dd5; font-size: 14px; font-weight: 500; letter-spacing: .5px; margin-bottom: 12px; border-radius: 4px; cursor: pointer;'>
                            Cancel
                        </button>
                        <button
                        onclick='onClickOption10("apply")'
                        id='widget-option-move-apply'
                        style='width: 120px; margin-left: 15px; border: 1px solid #006dd5; line-height: 38px; text-align: center; font-size: 14px; font-weight: 500; margin-bottom: 12px; border-radius: 4px; cursor: pointer; background: #006dd5; color: #fff;'>
                            Move Widget
                        </button>
                    </div>
            </div>
            <div id='main-widget-container'
                style='margin-top: 10px; user-select:none; display: none; height: 600px; width: 350px; background-color: #fdfcfc; border-radius: 10px; border: 1px solid #d4d4d4;'>
                <div
                    id='option-header'
                    style='display: flex; align-items: center; width: 100%; height: 60px; border-radius: 10px 10px 0px 0px; background: linear-gradient(to right, #43146deb, #4a1579fa, #43146D) !important;'>
                    <div
                        id='option-header'
                        style='display: flex; width: calc(100% - 40px); margin-left: 20px; color: white;'>
                        <p id='para-1' style='margin: 0; font-family: "Metropolis"'> Accessiblity Widget <span id='para-1' style='margin-left: 2px;'> (ctrl + u) </span> </p>
                        <p id='para-1' style='cursor: pointer; margin: 0; margin-left: auto; font-family: "Metropolis"' onclick="toggleWidget()"> Close </p>
                    </div>
                </div>
                <div 
                id='widget-window-container'
                style='width: calc(100% - 40px); height: 472px; margin-top: 20px; margin-left: 20px; border: 1px solid #b1b1b1; border-radius: 5px'; transition: opacity 500ms;>
                    <div style='display: flex; height: 95px;' id='option-1-2'>
                        <div id='option-1' onmouseover="mouseover('option-1')" onmouseout="mouseout('option-1')"
                            onclick="onClickOption1()"
                            style='padding-bottom: 10px; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 50%; border-right: 1px solid #c1c1c1; border-bottom: 1px solid #c1c1c1; border-top-left-radius: 5px;'>
                            <div id='option-1-icon'
                                style='position: absolute; display: none; width: calc(100% - 30px); height: calc(100%); justify-content: flex-end;'>
                                <img id='option-' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/tickIcon.png' height='30px' style='margin-top: 10px;' />
                            </div>
                            <img id='option-1-image' style='cursor: pointer; height: 60px;' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/keyboard-nav.png' />
                            <p id='para-1' style='color: black !important; cursor: pointer; margin: 0; font-family: "Metropolis"'> Keyboard Nav </p>
                        </div>
                        <div id='option-2' onmouseover="mouseover('option-2')" onmouseout="mouseout('option-2')"
                            onclick="onClickOption2()"
                            style='padding-bottom: 10px; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 50%; border-bottom: 1px solid #c1c1c1; border-top-right-radius: 5px;'>
                            <div id='option-2-icon'
                                style='position: absolute; display: none; width: calc(100% - 30px); height: calc(100%); justify-content: flex-end;'>
                                <img id='option-' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/tickIcon.png' height='30px' style='margin-top: 10px;' />
                            </div>
                            <img id='option-2-image' style='cursor: pointer; height: 60px;' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/read-normal.png' />
                            <p id='option-2-label' style='color: black !important; cursor: pointer; margin: 0; font-family: "Metropolis"'> Read Page </p>
                            <div id='option-2-bars'
                            style='position: absolute; display: none; width: calc(100% - 10px); height: 100%; align-items: flex-end;'>
                                <div id='option-2-bars-bars1'
                                    style='height: 4px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                                <div id='option-2-bars-bars2'
                                    style='height: 4px; opacity: 0.18; margin-left: 10px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                                <div id='option-2-bars-bars3'
                                    style='height: 4px; opacity: 0.18; margin-left: 10px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style='display: flex; height: 95px;' id='option-3-4'>
                        <div id='option-3' onmouseover="mouseover('option-3')" onmouseout="mouseout('option-3')"
                        onclick="onClickOption3()"
                            style='padding-bottom: 10px; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 50%; border-right: 1px solid #c1c1c1; border-bottom: 1px solid #c1c1c1;'>
                            <div 
                                id='option-3-icon'
                                style='position: absolute; display: none; width: calc(100% - 30px); height: calc(100%); justify-content: flex-end;'>
                                <img id='option-' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/tickIcon.png' height='30px' style='margin-top: 10px;' />
                            </div>
                            <img id='option-3-image' style='cursor: pointer; height: 60px;' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/contrast-3.png' />
                            <p id='option-3-label' style='color: black !important; cursor: pointer; margin: 0; font-family: "Metropolis"'> Contrast </p>
                            <div id='option-3-bars'
                                style='position: absolute; display: none; width: calc(100% - 10px); height: 100%; align-items: flex-end;'>
                                <div id='option-3-bars-bar1'
                                    style='height: 4px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                                <div id='option-3-bars-bar2'
                                    style='height: 4px; opacity: 0.18; margin-left: 10px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                                <div id='option-3-bars-bar3'
                                    style='height: 4px; opacity: 0.18; margin-left: 10px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                                <div id='option-3-bars-bar4'
                                    style='height: 4px; opacity: 0.18; margin-left: 10px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                            </div>
                        </div>
                        <div id='option-4' onmouseover="mouseover('option-4')" onmouseout="mouseout('option-4')"
                        onclick="onClickOption4()"
                            style='padding-bottom: 10px; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 50%; border-bottom: 1px solid #c1c1c1;'>
                            <div 
                                id='option-4-icon'
                                style='position: absolute; display: none; width: calc(100% - 30px); height: calc(100%); justify-content: flex-end;'>
                                <img id='option-' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/tickIcon.png' height='30px' style='margin-top: 10px;' />
                            </div>
                            <img id='option-4-image' style='cursor: pointer; height: 60px;' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/highlight-links.png' />
                            <p id='para-1' style='color: black !important; cursor: pointer; margin: 0; font-family: "Metropolis"'> Highlight Links </p>
                        </div>
                    </div>
                    <div style='display: flex; height: 95px;' id='option-5-6'>
                        <div id='option-5' onmouseover="mouseover('option-5')" onmouseout="mouseout('option-5')"
                        onclick="onClickOption5()"
                            style='padding-bottom: 10px; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 50%; border-right: 1px solid #c1c1c1; border-bottom: 1px solid #c1c1c1;'>
                            <div 
                                id='option-5-icon'
                                style='position: absolute; display: none; width: calc(100% - 30px); height: calc(100%); justify-content: flex-end;'>
                                <img id='option-' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/tickIcon.png' height='30px' style='margin-top: 10px;' />
                            </div>
                            <img id='option-5-image' style='cursor: pointer; height: 60px;' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/bigger-text-0.png' />
                            <p id='para-1' style='color: black !important; cursor: pointer; margin: 0; font-family: "Metropolis"'> Bigger Text </p>
                            <div id='option-5-bars'
                                style='position: absolute; display: none; width: calc(100% - 10px); height: 100%; align-items: flex-end;'>
                                <div id='option-5-bars-bar1'
                                    style='height: 4px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                                <div id='option-5-bars-bar2'
                                    style='height: 4px; opacity: 0.18; margin-left: 10px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                                <div id='option-5-bars-bar3'
                                    style='height: 4px; opacity: 0.18; margin-left: 10px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                                <div id='option-5-bars-bar4'
                                    style='height: 4px; opacity: 0.18; margin-left: 10px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                            </div>
                        </div>
                        <div id='option-6' onmouseover="mouseover('option-6')" onmouseout="mouseout('option-6')"
                        onclick="onClickOption6()"
                            style='padding-bottom: 10px; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 50%; border-bottom: 1px solid #c1c1c1;'>
                            <div 
                                id='option-6-icon'
                                style='position: absolute; display: none; width: calc(100% - 30px); height: calc(100%); justify-content: flex-end;'>
                                <img id='option-' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/tickIcon.png' height='30px' style='margin-top: 10px;' />
                            </div>
                            <img id='option-6-image' style='cursor: pointer; height: 60px;' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/text-spacing-1.png' />
                            <p id='para-1' style='color: black !important; cursor: pointer; margin: 0; font-family: "Metropolis"'> TextSpacing </p>
                            <div id='option-6-bars'
                                style='position: absolute; display: none; width: calc(100% - 10px); height: 100%; align-items: flex-end;'>
                                <div id='option-6-bars-bar1'
                                    style='height: 4px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                                <div id='option-6-bars-bar2'
                                    style='height: 4px; opacity: 0.18; margin-left: 10px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                                <div id='option-6-bars-bar3'
                                    style='height: 4px; opacity: 0.18; margin-left: 10px; border-radius: 40px; width: 25%; background: #43146D;'>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style='display: flex; height: 95px;' id='option-7-8'>
                        <div id='option-7' onmouseover="mouseover('option-7')" onmouseout="mouseout('option-7')"
                        onclick="onClickOption7()"
                            style='padding-bottom: 10px; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 50%; border-right: 1px solid #c1c1c1;'>
                            <div 
                                id='option-7-icon'
                                style='position: absolute; display: none; width: calc(100% - 30px); height: calc(100%); justify-content: flex-end;'>
                                <img id='option-' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/tickIcon.png' height='30px' style='margin-top: 10px;' />
                            </div>
                            <img id='option-7-image' style='cursor: pointer; height: 60px;' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/big-cursor-0.png' />
                            <p id='option-7-label' style='color: black !important; cursor: pointer; margin: 0; font-family: "Metropolis"'> Cursor </p>
                            <div id='option-7-bars'
                                style='position: absolute; display: none; padding-left: 10px; width: 100%; height: 100%; align-items: flex-end;'>
                                <div id='option-7-bars-bar1'
                                    style='height: 4px; border-radius: 40px; width: calc(50% - 10px); background: #43146D;'>
                                </div>
                                <div id='option-7-bars-bar2'
                                    style='height: 4px; opacity: 0.18; margin-left: 10px; border-radius: 40px; width: calc(50% - 10px); background: #43146D;'>
                                </div>
                            </div>
                        </div>
                        <div id='option-8' onmouseover="mouseover('option-8')" onmouseout="mouseout('option-8')"
                            onclick="onClickOption8()"
                            style='padding-bottom: 10px; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 50%;'>
                            <div id='option-8-icon'
                                style='position: absolute; display: none; width: calc(100% - 30px); height: calc(100%); justify-content: flex-end;'>
                                <img id='option-' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/tickIcon.png' height='30px' style='margin-top: 10px;' />
                            </div>
                            <img id='option-8-image' style='cursor: pointer; height: 60px;' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/legible-fonts.png' />
                            <p id='para-1' style='color: black !important; cursor: pointer; margin: 0; font-family: "Metropolis"'> Legible Fonts </p>
                                <div id='option-8-bars'
                                style='position: absolute; display: none; width: calc(100% - 10px); height: 100%; align-items: flex-end;'>
                                    <div id='option-8-bars-bar1'
                                        style='height: 4px; border-radius: 40px; width: 25%; background: #43146D;'>
                                    </div>
                                    <div id='option-8-bars-bar2'
                                        style='height: 4px; opacity: 0.18; margin-left: 10px; border-radius: 40px; width: 25%; background: #43146D;'>
                                    </div>
                                    <div id='option-8-bars-bar3'
                                        style='height: 4px; opacity: 0.18; margin-left: 10px; border-radius: 40px; width: 25%; background: #43146D;'>
                                    </div>
                                </div>
                        </div>
                    </div>
                    <div 
                        id='widget-other-options'
                        style='display: flex; height: 45px; border-top: 1px solid #c1c1c1; cursor: pointer;'>
                            <div
                            id='option-9'
                            onclick="onClickOption9()"
                            onmouseover="mouseover('option-9')" onmouseout="mouseout('option-9')" 
                            style='height: 100%; width: 50%; border-right: 1px solid #c1c1c1; display: flex; align-items: center; justify-content: center; border-bottom-left-radius: 5px;'>
                                <p  id='para-1' style='color: black !important; cursor: pointer; margin: 0; font-family: "Metropolis"'> Reset All </p>
                            </div>
                            <div
                            id='option-10'
                            onclick="onClickOption10()"
                            onmouseover="mouseover('option-10')" onmouseout="mouseout('option-10')"
                            style='height: 100%; width: 50%; display: flex; align-items: center; justify-content: center;'>
                                <p id='para-1' style='color: black !important; cursor: pointer; margin: 0; font-family: "Metropolis"'> Move/Hide </p>
                            </div>
                    </div>
                    <div 
                        id='widget-other-options'
                        style='display: flex; height: 45px; border-top: 1px solid #c1c1c1; cursor: pointer;'>
                            <div
                            id='option-11'
                            onclick="onClickOption11()"
                            onmouseover="mouseover('option-11')" onmouseout="mouseout('option-11')" 
                            style='height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;'>
                                <p  id='para-1' style='color: black !important; cursor: pointer; margin: 0; font-family: "Metropolis"'> Page Structure </p>
                            </div>
                    </div>
                </div>
                <div
                id='option-header'
                style='height: 50px; width: 100%; display: flex; align-items: center; justify-content: center;'>
                    <p id='para-1' style='font-size: 100%; color: #43146D; margin: 0;'> ASSIST </p>
                </div>
            </div>
            <div class="modal" id='widget-modal'>
                <div class="modal-content" id='widget-modal-content'>
                    <div id='widget-modal-header' style='display: flex; height: 50px; justify-content: space-between; background: linear-gradient(to right, #43146deb, #4a1579fa, #43146D) !important; border-radius: 0.4rem; border-bottom-left-radius: 0; border-bottom-right-radius: 0; padding: 0 10px 0 10px; align-items: center;'>
                    <p id='widget-modal-header-1' style='color: #ffffff; margin: 0'> Page Structure </p>
                    <span id='widget-modal-header-2' class="close-button" onclick="onClickOption11()">&times;</span>
                    </div>
                    <div id='widget-modal-header-tabs' style='display: flex; height: 50px;'>
                        <div id='widget-modal-header-tabs-1' onclick="togglePageStructureTab(0)"
                            style='cursor: pointer; color: #000000; display: flex; justify-content: center; align-items: center; width: 50%; height: 100%;'>
                            <p id='widget-modal-header-tabs-1-para' style='margin: 0;'> Headers </p>
                        </div>
                        <div id='widget-modal-header-tabs-2' onclick="togglePageStructureTab(1)"
                            style='cursor: pointer; display: flex; justify-content: center; align-items: center; width: 50%; height: 100%; background-color: #f2f2f2; color: #006dd5;'>
                            <p id='widget-modal-header-tabs-2-para' style='margin: 0;'> Links </p>
                        </div>
                    </div>
                    <div id='widget-modal-header-tabs-1-content' style='display: flex; flex-direction: column; height: calc(100% - 110px); padding: 5px 15px 0 15px; overflow: auto;'>
                    </div>
                    <div id='widget-modal-header-tabs-2-content' style='display: none; flex-direction: column; height: calc(100% - 110px); padding: 5px 15px 0 15px; overflow: auto;'>
                    </div>
                </div>
            </div>
            <div style='display: flex; position: relative; margin-left: 0' id='widget-main-icon-div' >
                <img
                id='widget-main-icon-div-icon' 
                src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assist-icon.png'
                style='cursor: pointer; height: 100px;' onclick="toggleWidget()" onmouseover="mouseOverWid(this)" onmouseout="mouseOutWid(this)"/>
                <div 
                    id='widget-option-main-icon'
                    style='position: absolute; display: none; width: 100%; justify-content: flex-end;'>
                    <img id='widget-main-icon-tick' src='https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/plugin-active.png' height='32px' />
                </div>
                <div id='hide' style='display: none; margin-left: -20px; position: absolute;  margin-top: 25px;'>
                <p id='option-hide' style='color: #fff; background-color: #43146D; padding: 0px 4px;  font-family:"Metropolis"' onclick="onHideClick()">Hide</p>
                </div>
            </div>
            </div>
        </div>
    </body>
    </html>
    `;
    document.write(mainWidget);
    widgetHideUnhide = document.getElementById('hide');
    clickAwayListener();
    onMouseMoveListener();
    isPluginActive();
    document.addEventListener('keyup', doc_keyUp, false);

    // initializePayment();
    // openModal();
}();

var initializePayment = () => {

    // const genesis = require('./config/genesis.js/lib/genesis');
    // const genesis = './config/default.json';
    console.log(window.genesis);
    console.log(window);

    // import * as genesis from './node_modules/genesis.js/lib/genesis';
    console.log(genesis);
}

var openModal = () => {
    fetchAllHeadings();
    const modal = document.querySelector(".modal");
    modal.classList.toggle("show-modal");
    showPageStructure = !showPageStructure;
}

var clickAwayListener = () => {
    const widgetContainer = document.getElementById("widget-window");
    const widgetModal = document.getElementById("widget-modal");
    window.onclick = function (event) {
        if (readPage !== 0) {
            readPageText(event.target);
        }
        if (showPageStructure) {
            if (event.target == widgetModal) {
                openModal()
                showPageStructure = !showPageStructure;
            }
        } else {
            if (event.target == widgetContainer) {
                const mainWidgetContainer = document.getElementById('main-widget-container');
                mainWidgetContainer.style.display = "none";

                if (selectedPosition === 1 || selectedPosition === 3) {
                    const mainContainer = document.getElementById('widget-main-div-both-container');
                    mainContainer.style.flexDirection = 'row';
                }
                if (selectedPosition === 2 || selectedPosition === 4) {
                    const mainContainer = document.getElementById('widget-main-div-both-container');
                    mainContainer.style.flexDirection = 'row-reverse';
                }

                showWidget = !showWidget;
            }
        }
    }
}

var onMouseMoveListener = () => {
    window.addEventListener('mousemove', e => {
        if (cursorOption === 2) {
            const readingLine = document.getElementById('widget-window-cursor');
            console.log(e);
            if (e.pageY > 30) {
                readingLine.style.marginTop = `${parseInt(e.pageY) - 80}px`;
            } else {
                readingLine.style.marginTop = parseInt(e.pageY) - 15;
            }
        }
    });
}

var doc_keyUp = (e) => {

    // this would test for whichever key is 40 and the ctrl key at the same time
    if (e.ctrlKey && e.keyCode == 85) {
        // call your function to do the thing
        toggleWidget();
    }
}

var toggleWidget = () => {
    if (showWidget) {
        let x = document.getElementById("main-widget-container");
        x.style.display = "none";

        let y = document.getElementById("main-widget-container-move");
        y.style.display = "none";

        if (selectedPosition === 1 || selectedPosition === 3) {
            const mainContainer = document.getElementById('widget-main-div-both-container');
            mainContainer.style.flexDirection = 'row';
        }
        if (selectedPosition === 2 || selectedPosition === 4) {
            const mainContainer = document.getElementById('widget-main-div-both-container');
            mainContainer.style.flexDirection = 'row-reverse';
        }

        showWidget = !showWidget;
    } else {
        mouseOutWid();
        let x = document.getElementById("main-widget-container");
        x.style.display = "block";
        showWidget = !showWidget;

        if (selectedPosition === 1 || selectedPosition === 3) {
            const mainContainer = document.getElementById('widget-main-div-both-container');
            mainContainer.style.flexDirection = 'row-reverse';
        }

        if (selectedPosition === 2 || selectedPosition === 4) {
            const mainContainer = document.getElementById('widget-main-div-both-container');
            mainContainer.style.flexDirection = 'row';
        }
    }
}

var mouseOverWid = () => {
    if (!showWidget) {
        widgetHideUnhide.style.display = 'block';
    }

}

var mouseOutWid = () => {
    // const w = document.getElementById('hide');
    // w.style.display = "none";
    setTimeout(
        function () {
            widgetHideUnhide.style.display = 'none';
        },
        1000);

}

var mouseover = (id) => {
    const x = document.getElementById(id);
    x.style.backgroundColor = "#f1f4f7";



}

var mouseout = (id) => {
    const x = document.getElementById(id);
    x.style.backgroundColor = "inherit";

}


var onHideClick = () => {
    if (!hideUnhide) {
        const x = document.getElementById("widget-main-icon-div");
        x.style.position = "absolute";
        if (selectedPosition === 1 || selectedPosition === 3) {
            x.style.marginLeft = "-60px";
        } else {
            x.style.marginLeft = "50px";
        }

        const currentlElemText = document.getElementById('option-hide');
        currentlElemText.innerHTML = 'Unhide';

        let y = document.getElementById("main-widget-container");
        y.style.display = "none";

        // const currentlElemHide = document.getElementById('hide');
        // currentlElemHide.style.right = '40px';

        hideUnhide = !hideUnhide
    } else {
        const x = document.getElementById("widget-main-icon-div");
        x.style.position = "relative";
        x.style.marginLeft = "0";

        const currentlElemText = document.getElementById('option-hide');
        currentlElemText.innerHTML = 'Hide';

        // const currentlElemHide = document.getElementById('hide');
        // currentlElemHide.style.right = '22px';

        hideUnhide = !hideUnhide
    }
}


var isPluginActive = () => {
    // if (keyboardNavigation) console.log('came 1');
    // if (readPage) console.log('came 2');
    // if (contrast) console.log('came 3');
    // if (highlighLinks) console.log('came 4');
    // if (fontSize) console.log('came 5');
    // if (letterSpacing) console.log('came 6');
    // if (cursorOption) console.log('came 7');
    // if (legibleFonts) console.log('came 8');
    // if (
    //     keyboardNavigation || readPage || contrast || highlighLinks
    //     || fontSize || letterSpacing || cursorOption || legibleFonts) {
    //     const activeIcon = document.getElementById('widget-option-main-icon');
    //     activeIcon.style.display = 'flex';
    // } else {
    //     const activeIcon = document.getElementById('widget-option-main-icon');
    //     activeIcon.style.display = 'none';
    // }
}

var onClickOption1 = () => {
    if (keyboardNavigation) {
        widgetEnabled = widgetEnabled - 1;
        if (widgetEnabled === 0) {
            const currentWidImage = document.getElementById('widget-main-icon-div-icon');
            currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assist-icon.png';

        }

        const elems = document.querySelectorAll("*");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].addEventListener('focusin', (event) => {
                event.target.style.outline = '-webkit-focus-ring-color auto 5px';
            });
        }
        const currentElem = document.getElementById('option-1')
        currentElem.style.border = 'none';
        currentElem.style.borderRight = '1px solid rgb(193, 193, 193)';
        currentElem.style.borderBottom = '1px solid rgb(193, 193, 193)';
        currentElem.style.borderRadius = 0;
        currentElem.style.borderTopLeftRadius = 5;
        currentElem.style.marginTop = 0;


        const currentElemChecked = document.getElementById('option-1-icon');
        currentElemChecked.style.display = 'none';
        keyboardNavigation = false;


    } else {
        widgetEnabled = widgetEnabled + 1;
        const currentWidImage = document.getElementById('widget-main-icon-div-icon');
        currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assistIcon2.png';

        const elems = document.querySelectorAll("*");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].addEventListener('focusin', (event) => {
                event.target.style.outline = '3px dashed #c00';
            });
            elems[index].addEventListener('focusout', (event) => {
                event.target.style.outline = 'none';
            });
        }
        const currentElem = document.getElementById('option-1')
        currentElem.style.border = '2px solid #43146D';
        currentElem.style.borderRadius = '5px';
        currentElem.style.marginTop = '-1px';
        const currentElemChecked = document.getElementById('option-1-icon');
        currentElemChecked.style.display = 'flex';

        keyboardNavigation = true;


    }
    isPluginActive();
}

var onClickOption2 = () => {
    if (readPage === 0) {
        window.speechSynthesis.cancel();

        const currentWidImage = document.getElementById('widget-main-icon-div-icon');
        currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assistIcon2.png';

        const currentElem = document.getElementById('option-2')
        currentElem.style.border = '2px solid #43146D';
        currentElem.style.borderRadius = '5px';
        currentElem.style.marginTop = '-1px';
        const currentElemChecked = document.getElementById('option-2-icon');
        currentElemChecked.style.display = 'flex';

        const currentlElemText = document.getElementById('option-2-label');
        currentlElemText.innerHTML = 'Read Normal';

        const currentlElemBars = document.getElementById('option-2-bars');
        currentlElemBars.style.display = 'flex';

        //set read page config
        utter.rate = 1;
        utter.pitch = 0.5;
        utter.text = 'Reading page normally';
        utter.voice = english_voice;

        readPage = 1;
        // speak
        window.speechSynthesis.speak(utter);
    } else if (readPage === 1) {
        window.speechSynthesis.cancel();

        const currentlElemText = document.getElementById('option-2-label');
        currentlElemText.innerHTML = 'Read Fast';

        const currentlElemBar2 = document.getElementById('option-2-bars-bars2');
        currentlElemBar2.style.opacity = 1;

        //set read page config
        utter.rate = 1.5;
        utter.pitch = 0.5;
        utter.text = 'Reading page faster';
        utter.voice = english_voice;

        readPage = 2;
        // speak
        window.speechSynthesis.speak(utter);
    } else if (readPage === 2) {
        window.speechSynthesis.cancel();

        const currentlElemText = document.getElementById('option-2-label');
        currentlElemText.innerHTML = 'Read Slow';

        const currentlElemBar3 = document.getElementById('option-2-bars-bars3');
        currentlElemBar3.style.opacity = 1;

        //set read page config
        utter.rate = 0.5;
        utter.pitch = 0.5;
        utter.text = 'Reading page slower';
        utter.voice = english_voice;

        readPage = 3;
        // speak
        window.speechSynthesis.speak(utter);
    } else {
        readPage = 0;
        window.speechSynthesis.cancel();

        const currentElem = document.getElementById('option-2')
        currentElem.style.border = 'none';
        currentElem.style.borderBottom = '1px solid rgb(193, 193, 193)';
        currentElem.style.borderRadius = 0;
        currentElem.style.borderTopLeftRadius = 5;
        currentElem.style.marginTop = 0;

        const currentElemChecked = document.getElementById('option-2-icon');
        currentElemChecked.style.display = 'none';

        const currentlElemText = document.getElementById('option-2-label');
        currentlElemText.innerHTML = 'Read Page';

        const currentlElemBars = document.getElementById('option-2-bars');
        currentlElemBars.style.display = 'none';

        const currentlElemBar2 = document.getElementById('option-2-bars-bars2');
        currentlElemBar2.style.opacity = 0.3;

        const currentlElemBar3 = document.getElementById('option-2-bars-bars3');
        currentlElemBar3.style.opacity = 0.3;

        //set read page config
        utter.rate = 1;
        utter.pitch = 0.5;
        utter.text = 'Reading page disabled';
        utter.voice = english_voice;

        // speak
        window.speechSynthesis.speak(utter);
    }
    isPluginActive();
}

var readPageText = (elem) => {
    window.speechSynthesis.cancel();
    Array.from(document.querySelectorAll('*')).map(item => {
        item.style.outline = 'none';
    })
    elem.style.outline = '-webkit-focus-ring-color auto 5px';
    utter.text = elem.innerText ? elem.innerText : '';

    // speak
    window.speechSynthesis.speak(utter);
}

var disableReadPage = () => {
    readPage = 0;
    const currentElem = document.getElementById('option-2')
    currentElem.style.border = 'none';
    currentElem.style.borderBottom = '1px solid rgb(193, 193, 193)';
    currentElem.style.borderRadius = 0;
    currentElem.style.borderTopLeftRadius = 5;
    currentElem.style.marginTop = 0;

    const currentElemChecked = document.getElementById('option-2-icon');
    currentElemChecked.style.display = 'none';

    const currentlElemText = document.getElementById('option-2-label');
    currentlElemText.innerHTML = 'Read Page';

    const currentlElemBars = document.getElementById('option-2-bars');
    currentlElemBars.style.display = 'none';

    const currentlElemBar2 = document.getElementById('option-2-bars-bars2');
    currentlElemBar2.style.opacity = 0.3;

    const currentlElemBar3 = document.getElementById('option-2-bars-bars3');
    currentlElemBar3.style.opacity = 0.3;

    window.speechSynthesis.cancel();
}

var invertColors = () => {
    // the css we are going to inject
    let css = 'html {-webkit-filter: invert(100%);' +
        '-moz-filter: invert(100%);' +
        '-o-filter: invert(100%);' +
        '-ms-filter: invert(100%); ' +
        'filter: invert(100%); ' +
        'filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'invert\'><feColorMatrix in=\'SourceGraphic\' type=\'matrix\' values=\'-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0\'/></filter></svg>#invert"); }'
        ,

        head = document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    // a hack, so you can "invert back" clicking the bookmarklet again
    if (!window.counter) { window.counter = 1; } else {
        window.counter++;
        if (window.counter % 2 == 0) { css = 'html {-webkit-filter: invert(0%); -moz-filter:    invert(0%); -o-filter: invert(0%); -ms-filter: invert(0%); }' }
    };

    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
}

var geryscaleContrast = (contrast) => {
    if (contrast === 3) {
        let css = 'html {-webkit-filter: invert(100%);' +
            '-moz-filter: grayscale(100%);' +
            '-o-filter: grayscale(100%);' +
            '-ms-filter: grayscale(100%); ' +
            '-webkit-filter: grayscale(100%); ' +
            'filter: grayscale(100%); '
            ,

            head = document.getElementsByTagName('head')[0],
            style = document.createElement('style');


        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    } else {
        let css = 'html {-webkit-filter: invert(100%);' +
            '-moz-filter: none;' +
            '-o-filter: none;' +
            '-ms-filter: none; ' +
            '-webkit-filter: none; ' +
            'filter: none; '
            ,

            head = document.getElementsByTagName('head')[0],
            style = document.createElement('style');


        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }
}

var darkContrast = (flag) => {
    if (flag) {
        const getAllElements = Array.from(document.querySelectorAll('*')).filter(item => {
            if (item.id) {
                const id = item.id.toString();
                if ((id.includes('option-') && (id.includes('-icon') || id.includes('-bars') || id.includes('-image') ||
                    id.includes('option-') || id.includes('-option'))) || id === 'main-widget-container' ||
                    id.includes('para-1') || id.includes('-image') || id.includes('widget-')) {
                    return false;
                }
            }
            return item;
        });
        defaultElementsStyles = [];
        getAllElements.forEach(item => {
            defaultElementsStyles.push({
                item,
                color: item.style.color,
                backgroundColor: item.style.backgroundColor
            });
            if (window.getComputedStyle(item).color === 'rgb(0, 0, 0)') item.style.color = 'white';
            item.style.backgroundColor = 'black';
        })
    } else {
        const getAllElements = Array.from(document.querySelectorAll('*')).filter(item => {
            if (item.id) {
                const id = item.id.toString();
                if ((id.includes('option-') && (id.includes('-icon') || id.includes('-bars') || id.includes('-image') ||
                    id.includes('option-') || id.includes('-option'))) || id === 'main-widget-container' ||
                    id.includes('para-1') || id.includes('-image') || id.includes('widget-')) {
                    return false;
                }
            }
            return item;
        });
        getAllElements.forEach((item, index) => {
            item.style.color = defaultElementsStyles[index].color;
            item.style.backgroundColor = defaultElementsStyles[index].backgroundColor;
        })
        defaultElementsStyles = [];
    }
}

var lighContrast = (flag) => {
    if (flag) {
        const getAllElements = Array.from(document.querySelectorAll('*')).filter(item => {
            if (item.id) {
                const id = item.id.toString();
                if ((id.includes('option-') && (id.includes('-icon') || id.includes('-bars'))) || id === 'main-widget-container' || id.includes('widget-')) {
                    return false;
                }
            }
            return item;
        });
        getAllElements.forEach(item => {
            defaultElementsStyles.push({
                item,
                color: item.style.color,
                backgroundColor: item.style.backgroundColor
            });
            if (window.getComputedStyle(item).color === 'rgb(255, 255, 255)') item.style.color = 'black';
            item.style.backgroundColor = 'unset';
        })
    } else {
        const getAllElements = Array.from(document.querySelectorAll('*')).filter(item => {
            if (item.id) {
                const id = item.id.toString();
                if ((id.includes('option-') && (id.includes('-icon') || id.includes('-bars'))) || id === 'main-widget-container' || id.includes('widget-')) {
                    return false;
                }
            }
            return item;
        });
        getAllElements.forEach((item, index) => {
            item.style.color = defaultElementsStyles[index].color;
            item.style.backgroundColor = defaultElementsStyles[index].backgroundColor;
        })
        defaultElementsStyles = [];
    }
}

var onClickOption3 = () => {
    if (contrast === 0) {
        contrast = 1;
        invertColors();

        const currentElem = document.getElementById('option-3')
        currentElem.style.border = '2px solid #43146D';
        currentElem.style.borderRadius = '5px';
        currentElem.style.marginTop = '-1px';

        const currentElemChecked = document.getElementById('option-3-icon');
        currentElemChecked.style.display = 'flex';

        const currentlElemBars = document.getElementById('option-3-bars');
        currentlElemBars.style.display = 'flex';

        const currentlElemText = document.getElementById('option-3-label');
        currentlElemText.innerHTML = 'Invert Colors';

        const currentElemImage = document.getElementById('option-3-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/contrast-1.png';

        const currentWidImage = document.getElementById('widget-main-icon-div-icon');
        currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assistIcon2.png';

    } else if (contrast === 1) {
        invertColors();
        darkContrast(true);
        const currentlElemBars = document.getElementById('option-3-bars-bar2');
        currentlElemBars.style.opacity = 1;

        const currentlElemText = document.getElementById('option-3-label');
        currentlElemText.innerHTML = 'Dark Contrast';

        const currentElemImage = document.getElementById('option-3-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/contrast-2.png';
        contrast = 2;
    } else if (contrast === 2) {
        darkContrast(false);
        lighContrast(true);
        const currentlElemText = document.getElementById('option-3-label');
        currentlElemText.innerHTML = 'Light Contrast';

        const currentElemImage = document.getElementById('option-3-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/contrast-3.png';

        const currentlElemBars = document.getElementById('option-3-bars-bar3');
        currentlElemBars.style.opacity = 1;
        contrast = 3;
    } else if (contrast === 3) {
        lighContrast(false);
        geryscaleContrast(contrast);
        const currentlElemText = document.getElementById('option-3-label');
        currentlElemText.innerHTML = 'Desaturate';

        const currentElemImage = document.getElementById('option-3-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/contrast-0.png';

        const currentlElemBars = document.getElementById('option-3-bars-bar4');
        currentlElemBars.style.opacity = 1;
        contrast = 4;
    } else {
        geryscaleContrast(contrast);
        const currentlElemText = document.getElementById('option-3-label');
        currentlElemText.innerHTML = 'Contrast';

        const currentElemImage = document.getElementById('option-3-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/contrast-3.png';

        contrast = 0;
        const currentElem = document.getElementById('option-3')
        currentElem.style.border = 'none';
        currentElem.style.borderRight = '1px solid rgb(193, 193, 193)';
        currentElem.style.borderBottom = '1px solid rgb(193, 193, 193)';
        currentElem.style.borderRadius = 0;
        currentElem.style.borderTopLeftRadius = 5;
        currentElem.style.marginTop = 0;

        const currentElemChecked = document.getElementById('option-3-icon');
        currentElemChecked.style.display = 'none';

        const currentlElemBars = document.getElementById('option-3-bars');
        currentlElemBars.style.display = 'none';

        const currentOptionBars = document.querySelectorAll('[id^="option-3-bars-"]');
        let index1 = 1;
        const length = currentOptionBars.length;
        for (; index1 < length; index1++) {
            currentOptionBars[index1].style.opacity = 0.18;
        }

        const currentWidImage = document.getElementById('widget-main-icon-div-icon');
        currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assist-icon.png';
    }
    isPluginActive();
}

var onClickOption4 = () => {
    if (highlighLinks) {
        widgetEnabled = widgetEnabled - 1;
        if (widgetEnabled === 0) {
            const currentWidImage = document.getElementById('widget-main-icon-div-icon');
            currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assist-icon.png';

        }

        const elems = document.links;
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.backgroundColor = defaultLinksStyles[index].backgroundColor;
            elems[index].style.color = defaultLinksStyles[index].color;
            elems[index].style.textDecoration = defaultLinksStyles[index].decoration;
        }
        const currentElem = document.getElementById('option-4')
        currentElem.style.border = 'none';
        currentElem.style.borderRadius = '0px';
        currentElem.style.marginTop = '0';
        currentElem.style.borderBottom = '1px solid #c1c1c1';
        const currentElemChecked = document.getElementById('option-4-icon');
        currentElemChecked.style.display = 'none';
        defaultLinksStyles = [];
        highlighLinks = !highlighLinks;
    } else {
        widgetEnabled = widgetEnabled + 1;
        const currentWidImage = document.getElementById('widget-main-icon-div-icon');
        currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assistIcon2.png';


        const elems = document.links;
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            defaultLinksStyles.push({
                backgroundColor: elems[index].style.backgroundColor,
                color: elems[index].style.color,
                decoration: elems[index].style.textDecoration
            });
            elems[index].style.backgroundColor = "black";
            elems[index].style.color = "#ff0";
            elems[index].style.textDecoration = "underline";
        }
        const currentElem = document.getElementById('option-4')
        currentElem.style.border = '2px solid #43146D';
        currentElem.style.borderRadius = '5px';
        currentElem.style.marginTop = (keyboardNavigation) ? '-2px' : '-1px';
        const currentElemChecked = document.getElementById('option-4-icon');
        currentElemChecked.style.display = 'flex';
        highlighLinks = !highlighLinks;
    }
    isPluginActive();
}

var onClickOption5 = () => {
    if (fontSize === 0) {
        fontSize = fontSize + 1;
        widgetEnabled = widgetEnabled + 1;
        const currentWidImage = document.getElementById('widget-main-icon-div-icon');
        currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assistIcon2.png';

        let elems = document.querySelectorAll("p ,a");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.fontSize = "107%";
        }
        const currentElem = document.querySelectorAll('#para-1, #option-7-label, #option-2-label, #option-3-label');
        let indexPara = 0;
        length = currentElem.length;
        for (; indexPara < length; indexPara++) {
            currentElem[indexPara].style.fontSize = "100%";
        }
        const currentlElemBars = document.getElementById('option-5-bars');
        currentlElemBars.style.display = 'flex';

        const currentElemStyle = document.getElementById('option-5')
        currentElemStyle.style.border = '2px solid #43146D';
        currentElemStyle.style.borderRadius = '5px';
        currentElemStyle.style.marginTop = '-1px';

        const currentElemImage = document.getElementById('option-5-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/bigger-text-1.png';

        const currentElemChecked = document.getElementById('option-5-icon');
        currentElemChecked.style.display = 'flex';

    } else if (fontSize === 1) {
        fontSize = fontSize + 1;

        let elems = document.querySelectorAll("p ,a");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.fontSize = '114%';
        }

        const currentlElemBars = document.getElementById('option-5-bars-bar2');
        currentlElemBars.style.opacity = 1;

        const currentElem = document.querySelectorAll('#para-1, #option-7-label, #option-2-label, #option-3-label');

        let indexPara = 0;
        length = currentElem.length;
        for (; indexPara < length; indexPara++) {
            currentElem[indexPara].style.fontSize = "100%";
        }

        const currentElemImage = document.getElementById('option-5-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/bigger-text-2.png';

        const currentElemChecked = document.getElementById('option-5-icon');
        currentElemChecked.style.display = 'flex';
    } else if (fontSize === 2) {
        fontSize = fontSize + 1;

        let elems = document.querySelectorAll("p ,a");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.fontSize = '125%';
        }

        const currentlElemBars = document.getElementById('option-5-bars-bar3');
        currentlElemBars.style.opacity = 1;

        const currentElem = document.querySelectorAll('#para-1, #option-7-label, #option-2-label, #option-3-label');

        let indexPara = 0;
        length = currentElem.length;
        for (; indexPara < length; indexPara++) {
            currentElem[indexPara].style.fontSize = "100%";
        }

        const currentElemImage = document.getElementById('option-5-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/bigger-text-3.png';

        const currentElemChecked = document.getElementById('option-5-icon');
        currentElemChecked.style.display = 'flex';

    } else if (fontSize === 3) {
        fontSize = fontSize + 1;

        let elems = document.querySelectorAll("p , a");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.fontSize = '140%';
        }

        const currentlElemBars = document.getElementById('option-5-bars-bar4');
        currentlElemBars.style.opacity = 1;

        const currentElem = document.querySelectorAll('#para-1, #option-7-label, #option-2-label, #option-3-label');

        let indexPara = 0;
        length = currentElem.length;
        for (; indexPara < length; indexPara++) {
            currentElem[indexPara].style.fontSize = "100%";
        }

        const currentElemImage = document.getElementById('option-5-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/bigger-text-4.png';

        const currentElemChecked = document.getElementById('option-5-icon');
        currentElemChecked.style.display = 'flex';

    }
    else {
        fontSize = 0;
        widgetEnabled = widgetEnabled - 1;
        if (widgetEnabled === 0) {
            const currentWidImage = document.getElementById('widget-main-icon-div-icon');
            currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assist-icon.png';

        }
        let elems = document.querySelectorAll("p ,a");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.fontSize = "100%";
        }
        const currentElem = document.querySelectorAll('#para-1, #option-7-label, #option-2-label, #option-3-label');
        let indexPara = 0;
        length = currentElem.length;
        for (; indexPara < length; indexPara++) {
            currentElem[indexPara].style.fontSize = "100%";
        }
        const currentlElemBars = document.getElementById('option-5-bars');
        currentlElemBars.style.display = 'none';

        const currentElemChecked = document.getElementById('option-5-icon');
        currentElemChecked.style.display = 'none';

        const currentOptionBars = document.querySelectorAll('[id^="option-5-bars-"]');
        let index1 = 1;
        length = currentOptionBars.length;
        for (; index1 < length; index1++) {
            currentOptionBars[index1].style.opacity = 0.18;
        }

        const currentElemImage = document.getElementById('option-5-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/bigger-text-0.png';

        const currentElemStyle = document.getElementById('option-5')
        currentElemStyle.style.border = 'none';

        currentElemStyle.style.borderRight = '1px solid rgb(193, 193, 193)';
        currentElemStyle.style.borderBottom = '1px solid rgb(193, 193, 193)';
        currentElemStyle.style.borderRadius = '0px';
        currentElemStyle.style.marginTop = '0';
    }
    isPluginActive();
}

var onClickOption6 = () => {
    if (letterSpacing === 0) {
        widgetEnabled = widgetEnabled + 1;
        const currentWidImage = document.getElementById('widget-main-icon-div-icon');
        currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assistIcon2.png';
        letterSpacing = letterSpacing + 1;
        const currentElemChecked = document.getElementById('option-6-icon');
        currentElemChecked.style.display = 'flex';
        let elems = document.querySelectorAll("p, a");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.letterSpacing = '2px';
        }

        const currentlElemBars = document.getElementById('option-6-bars');
        currentlElemBars.style.display = 'flex';

        const currentElem = document.querySelectorAll('#para-1, #option-7-label, #option-2-label, #option-3-label');

        let indexPara = 0;
        length = currentElem.length;
        for (; indexPara < length; indexPara++) {
            currentElem[indexPara].style.letterSpacing = "initial";
        }

        const currentElemImage = document.getElementById('option-6-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/CODIE Icons-15.png';

        const currentElemStyle = document.getElementById('option-6')
        currentElemStyle.style.border = '2px solid #43146D';
        currentElemStyle.style.borderRadius = '5px';
        currentElemStyle.style.marginTop = '-1px';

    } else if (letterSpacing === 1) {
        letterSpacing = letterSpacing + 1;
        let elems = document.querySelectorAll("p, a");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.letterSpacing = '3px';
        }

        const currentElem = document.querySelectorAll('#para-1, #option-7-label, #option-2-label, #option-3-label');

        const currentlElemBars = document.getElementById('option-6-bars-bar2');
        currentlElemBars.style.opacity = 1;

        let indexPara = 0;
        length = currentElem.length;
        for (; indexPara < length; indexPara++) {
            currentElem[indexPara].style.letterSpacing = "initial";
        }

        const currentElemImage = document.getElementById('option-6-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/CODIE Icons-301.png';

        const currentElemChecked = document.getElementById('option-6-icon');
        currentElemChecked.style.display = 'flex';

    } else if (letterSpacing === 2) {
        letterSpacing = letterSpacing + 1;

        let elems = document.querySelectorAll("p, a");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.letterSpacing = '4px';
        }

        const currentElem = document.querySelectorAll('#para-1, #option-7-label, #option-2-label, #option-3-label');

        const currentlElemBars = document.getElementById('option-6-bars-bar3');
        currentlElemBars.style.opacity = 1;

        let indexPara = 0;
        length = currentElem.length;
        for (; indexPara < length; indexPara++) {
            currentElem[indexPara].style.letterSpacing = "initial";
        }
        const currentElemImage = document.getElementById('option-6-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/CODIE Icons-05.png';

        const currentElemChecked = document.getElementById('option-6-icon');
        currentElemChecked.style.display = 'flex';
    } else {
        widgetEnabled = widgetEnabled - 1;
        if (widgetEnabled === 0) {
            const currentWidImage = document.getElementById('widget-main-icon-div-icon');
            currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assist-icon.png';

        }
        letterSpacing = 0;
        let elems = document.querySelectorAll("p, a");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.letterSpacing = "initial";
        }
        const currentElem = document.querySelectorAll('#para-1, #option-7-label, #option-2-label, #option-3-label');
        let indexPara = 0;
        length = currentElem.length;
        for (; indexPara < length; indexPara++) {
            currentElem[indexPara].style.fontSize = "initial";
        }
        const currentElemChecked = document.getElementById('option-6-icon');
        currentElemChecked.style.display = 'none';

        const currentlElemBars = document.getElementById('option-6-bars');
        currentlElemBars.style.display = 'none';

        const currentOptionBars = document.querySelectorAll('[id^="option-6-bars-"]');
        let index1 = 1;
        length = currentOptionBars.length;
        for (; index1 < length; index1++) {
            currentOptionBars[index1].style.opacity = 0.18;
        }

        const currentElemImage = document.getElementById('option-6-image');
        currentElemImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/text-spacing-1.png';

        const currentElemStyle = document.getElementById('option-6')
        currentElemStyle.style.border = 'none';
        currentElemStyle.style.borderRadius = 0;
        currentElemStyle.style.borderBottom = '1px solid rgb(193, 193, 193)';
        currentElemStyle.style.marginTop = '0';
    }
    isPluginActive();
}

var onClickOption7 = () => {
    if (cursorOption === 0) {
        widgetEnabled = widgetEnabled + 1;
        const currentWidImage = document.getElementById('widget-main-icon-div-icon');
        currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assistIcon2.png';
        document.querySelectorAll('*').forEach(function (node) {
            defaultElementsCursors.push(node.style.cursor);
            // node.style.cursor = 'url("https://img.icons8.com/ios/80/000000/cursor.png"), auto';
            // const bigCursorIcon = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/big-cursor.png';
            // node.style.cursor = 'url("https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/big-cursor.png"), auto';
            node.style.cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABTCAYAAAAvKwHrAAAIUklEQVR4Xu2cb0yNbRzHfwelMVlN5k/atBnLZvKieIleGHnFKe30oFCGkUpLdaxJreWUvGAKHXqccYpXYl6El9QLGdOYLVv5n9VkLML17OqRnbrv+7q+93Xuo8Pz3Jv14v79+f4+9+/+c/1xbPQfP2wq9Tc2NrKHDx9SaGgolZeXK8VQyRsIH1PinU4nKysrM9JhKlYgilGJCYvesGEDu3LlijBHRUUFFRUVwTFVBFvtA4n1eDzM4XBAufPz88nlckFxoYABNoKERkVFsd7eXlgKh+XxeKDYcNAAGaIimdn8SUlJ1NraisY3G94ye1SgBkB4eDh9/fqVPn36ZChm+fLldPfuXTSHZUWZCYSK0wBYvHgxPXr0yBYSEsKGhoYMc8bFxVFnZyeax4x2S2xRYRoAMTEx1N3dPewfFhbGBgcHDQXNnj2bXr16heaypDA0CCpKCIAni4yMZH19fYZ5J06cSN++fUPzofr9tkMFaQDMmzePenp6RvnHx8ezjo4OmSg0pyyOJedRMRAArmjt2rXs+vXrMnFoXlkcv8+jQmAAXFF6ejq7cOGCTByaWxbHr/OoCFMAuKKcnBxWW1srE4fml8VRPo8K0ACIjo6m58+fC/1LS0tZaWmpUFxzczPZ7XZUh3KhRo5oYiUAPOnJkyfZrl27hMLr6+spKysL1WIpBDSpMgCu1uv1stTUVKHww4cP06FDh1A9lkFAE/oFwEetcEyRl5dH1dXVqCZLIKDJNMLnzJlDL1++RP19xQohZGRkkNvtVomrBARNZCUALlQIITk5mVpaWlBtSoWPOKFJrAYghZCQkEDt7e2oPmUIaIJAACCbzcYYM26GmTNn0tu3b1GNShDQ4AEBwBXLZpumTJnC5xxQnaYhoIE1AKwc4i5atIg9fvzYUPykSZP45Auq1RQENGhAAXDFCQkJrL293VC8zWYjxhiqF4aABgw4AK545cqV7Pbt2zLxqGZZnOHzaLBfAoALSk1NZV6vVyYe1S2Low5g1qxZ9Pr1a8uE+Cr9lSNJtABNBwT6FVVWVsacTqfwCloxklQGEMgOGKn61KlTbOfOnUIIJ06coN27d6N1aGKhjpoO+BUAuNqmpiaWkpIihMAXbJ1OJ1rLqFio07gB8FErHD/s27ePjh8/jtbzMyzqoEkeFRVFvb29qL/0aQwaCCFs3LiRLl++bEoTahwsAKSDqNWrV9PNmzfRutRfg+PUASONIuyExMREamtrgyBARnrj93EGIB1JomuSygBmzJhB7969Q/3BW9ycmWxNErlIaAGalgsGABxXTEwM6+7ulpEzrPO3B8ArT0xMZG1tbUoQ/ggAvPJ169axa9eumYbwxwDglWdkZDC3220KgjKAyMhI6uvrQ/1loiw7v3//fnbs2DHDeMXFxaM2d6IFaB6CwQqAV37kyBFWUlKiC2Hsm+GPBMArd7vdjC+yGBw/6/6tATQ0NLAXL17wVWoa+dvV1UUDAwOGt8DYuUVlABEREdTf34/6w/d4TU3N8F6jnp4evrGKD7iG/75584ZPisJxjAwXLFhAT58+9b8DAgVAtmzmL4EzZ87Q9u3bgxcAsqlCFcL8+fPp2bNno7oWbWFN7wWwA6RDXhUAvvsaff3HAwCHKcybnZ3N6urqVOrU+Mi26yoDmD59Or1//x71HzWO37JlC50/f17mq/vE409xvj+J/+Mtzfcrzp07l/bu3SuLpwsUddKIUQAwNoYwt9F+Q6vXCQMOoKHhLMvM3KahX11dTXl5ebL8ul3Q0HCWMjO3yXyhWwgNohHCt8sPDAwI/auqqlhBQYGukMmTJ9Pnz5+F/gsXLmRPnjzR+Fu5UKoMYNq0afThwwdD/4KCAlZVVSW7Ckh+o68fxFeWX31SVNQBO3bsYKdPn5YmX7JkCT148EBYiNG0l1WDMZQifAukpKSwpqYmafE+BkINkj2GqH7jsQGoFAKQlJTEWltbwZD/mm3e/Bc1Nv4tK0T3NjAz/S0dFkpUawSMfQbExcWxzs5OU8WjXeByuRj/73gGhwyeUBPqrAEwdepU+vjx47B/REQE6+/vN0zk882geyUrKyupsLBQpkXX1263U3Nzs8zX+ltgZH9AaGgo+/Lli2EC32/w5ORk1tLSonQlDxw4wI4eParkK2oBlJyGflhYGH3//p1ExcfHx1NHR8fYHP681nR9c3JyqLa2Fq1lFA/UyfRMxKpVq+jWrVua+NHR0YzP4Iw9kP0GaWlp7OLFi5Z2AQRg6dKl7P79+/ADjm+N93q9otiWd4HL5aL8/HyoHt9CzDhAXZCdnU11dXWyuLqxkE3SK1asYHfu3LGsC2RCfybKzc1lNTU1wi4oKiqiiooKaczy8nLG5+f9eK3pAuS3R1pamjS/agdQfX09y8rK8ke4r69uEYWFhVRZWSkswmhBNCQkhIaGhgIHwFc938Y2YcIEKi4uNpVwJIbD4WAej0cD08RIz5/nyM+8SuLhp6HcULcIDsbhcAi1GW21X79+PV29ehWuCzaU12LeYtmyZezevXsax9jYWOrq6kK0Cb9QEUVIEiSOPzamW5mPEPfs2TO8aDL24B9og4ODcF2woT8VinzDw8OZ3lLWmjVr6MaNG6P0SX7FZjgN8ipVfgsEAgJfCsvNzRW+Wex2O+P7gsHD1EU1ZQwKUDHTvQ1+LL7A8VTmB4ICwNatW9m5c+fgQvUMDQZe0phBAeCHSuhTe2xFfJ2Aw0tPT1eqRclJilXBwOR9TuhGSJmUoAHAhcbGxjK+wUF0bNq0iS5dumSZbssCyUij5/n+Hv6bA/w3ikYOPv128OBBKikpsVyv5QHRQoPF7n8AwXIlxkvHP/8kSYH/53DxAAAAAElFTkSuQmCC"), auto';
        });
        const currentElemChecked = document.getElementById('option-7-icon');
        currentElemChecked.style.display = 'flex';

        const currentlElemText = document.getElementById('option-7-label');
        currentlElemText.innerHTML = 'Big Cursor';

        const currentlElemBars = document.getElementById('option-7-bars');
        currentlElemBars.style.display = 'flex';

        const currentElem = document.getElementById('option-7')
        currentElem.style.border = '2px solid #43146D';
        currentElem.style.borderRadius = '5px';
        currentElem.style.marginTop = '-1px';
        // document.body.style.cursor = 'url("https://img.icons8.com/ios/80/000000/cursor.png"), auto !important';
        cursorOption = 1;
    } else if (cursorOption === 1) {
        const currentlElemText = document.getElementById('option-7-label');
        currentlElemText.innerHTML = 'Reading Guide';

        const readingLine = document.getElementById('widget-window-cursor');
        readingLine.style.display = 'flex';

        const currentlElemBar2 = document.getElementById('option-7-bars-bar2');
        currentlElemBar2.style.opacity = 1;
        cursorOption = 2;
    } else {
        // document.body.style.cursor = 'unset';
        widgetEnabled = widgetEnabled - 1;
        if (widgetEnabled === 0) {
            const currentWidImage = document.getElementById('widget-main-icon-div-icon');
            currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assist-icon.png';

        }
        document.querySelectorAll('*').forEach(function (node, index) {
            node.style.cursor = defaultElementsCursors[index] && defaultElementsCursors[index] === '' ? 'default' : defaultElementsCursors[index];
        });
        const currentElemChecked = document.getElementById('option-7-icon');
        currentElemChecked.style.display = 'none';

        const currentlElemText = document.getElementById('option-7-label');
        currentlElemText.innerHTML = 'Cursor';

        const readingLine = document.getElementById('widget-window-cursor');
        readingLine.style.display = 'none';

        const currentlElemBars = document.getElementById('option-7-bars');
        currentlElemBars.style.display = 'none';

        const currentElem = document.getElementById('option-7')
        currentElem.style.border = 'none';
        currentElem.style.borderRight = '1px solid rgb(193, 193, 193)';
        currentElem.style.borderRadius = '0px';
        currentElem.style.marginTop = '0';

        const currentlElemBar2 = document.getElementById('option-7-bars-bar2');
        currentlElemBar2.style.opacity = 0.18;
        defaultElementsCursors = [];
        cursorOption = 0;
    }
    isPluginActive();
}

var onClickOption8 = () => {
    if (legibleFonts === 0) {
        widgetEnabled = widgetEnabled + 1;
        const currentWidImage = document.getElementById('widget-main-icon-div-icon');
        currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assistIcon2.png';
        legibleFonts = legibleFonts + 1;
        let elems = document.querySelectorAll("p ,a");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.fontFamily = "Arial";
        }
        const currentElem = document.querySelectorAll('#para-1, #option-7-label, #option-2-label, #option-3-label');
        let indexPara = 0;
        length = currentElem.length;
        for (; indexPara < length; indexPara++) {
            currentElem[indexPara].style.fontFamily = 'Metropolis';
        }

        const currentlElemBars = document.getElementById('option-8-bars');
        currentlElemBars.style.display = 'flex';

        const currentElemChecked = document.getElementById('option-8-icon');
        currentElemChecked.style.display = 'flex';

        const currentElemStyle = document.getElementById('option-8')
        currentElemStyle.style.border = '2px solid #43146D';
        currentElemStyle.style.borderRadius = '5px';
        currentElemStyle.style.marginTop = '-1px';

    } else if (legibleFonts === 1) {
        legibleFonts = legibleFonts + 1;
        let elems = document.querySelectorAll("p ,a");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.fontFamily = "Verdana";
        }
        const currentElem = document.querySelectorAll('#para-1, #option-7-label, #option-2-label, #option-3-label');
        let indexPara = 0;
        length = currentElem.length;
        for (; indexPara < length; indexPara++) {
            currentElem[indexPara].style.fontFamily = 'Metropolis';
        }
        const currentElemChecked = document.getElementById('option-8-icon');
        currentElemChecked.style.display = 'flex';

        const currentlElemBars = document.getElementById('option-8-bars-bar2');
        currentlElemBars.style.opacity = 1;

        const currentElemStyle = document.getElementById('option-8')
        currentElemStyle.style.border = '2px solid #43146D';
        currentElemStyle.style.borderRadius = '5px';
        currentElemStyle.style.marginTop = '-1px';

    } else if (legibleFonts === 2) {
        legibleFonts = legibleFonts + 1;
        let elems = document.querySelectorAll("p ,a");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.fontFamily = "Tahoma";
        }
        const currentElem = document.querySelectorAll('#para-1, #option-7-label, #option-2-label, #option-3-label');
        let indexPara = 0;
        length = currentElem.length;
        for (; indexPara < length; indexPara++) {
            currentElem[indexPara].style.fontFamily = 'Metropolis';
        }
        const currentElemChecked = document.getElementById('option-8-icon');
        currentElemChecked.style.display = 'flex';

        const currentlElemBars = document.getElementById('option-8-bars-bar3');
        currentlElemBars.style.opacity = 1;

        const currentElemStyle = document.getElementById('option-8')
        currentElemStyle.style.border = '2px solid #43146D';
        currentElemStyle.style.borderRadius = '5px';
        currentElemStyle.style.marginTop = '-1px';

    } else {
        widgetEnabled = widgetEnabled - 1;
        if (widgetEnabled === 0) {
            const currentWidImage = document.getElementById('widget-main-icon-div-icon');
            currentWidImage.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assist-icon.png';

        }
        legibleFonts = 0;
        let elems = document.querySelectorAll("p ,a");
        let index = 0, length = elems.length;
        for (; index < length; index++) {
            elems[index].style.fontFamily = 'inherit';
        }

        const currentElem = document.querySelectorAll('#para-1, #option-7-label, #option-2-label, #option-3-label');

        let indexPara = 0;
        length = currentElem.length;
        for (; indexPara < length; indexPara++) {
            currentElem[indexPara].style.fontFamily = "Metropolis";
        }
        const currentElemChecked = document.getElementById('option-8-icon');
        currentElemChecked.style.display = 'none';

        const currentlElemBars = document.getElementById('option-8-bars');
        currentlElemBars.style.display = 'none';

        const currentOptionBars = document.querySelectorAll('[id^="option-8-bars-"]');
        let index1 = 1;

        length = currentOptionBars.length;
        for (; index1 < length; index1++) {
            currentOptionBars[index1].style.opacity = 0.18;
        }


        const currentElemStyle = document.getElementById('option-8')
        currentElemStyle.style.border = 'none';
        currentElemStyle.style.borderRadius = '0px';
        currentElemStyle.style.marginTop = '0';
    }
    isPluginActive();
}

var onClickOption9 = () => {
    if (keyboardNavigation) {
        onClickOption1();
    }
    if (readPage) {
        disableReadPage();
    }
    if (contrast) {
        if (contrast === 1) {
            onClickOption3();
            contrast = 2;
            onClickOption3();
            contrast = 3;
            onClickOption3();
            contrast = 4;
            onClickOption3();
        } else if (contrast === 2) {
            onClickOption3();
            contrast = 3;
            onClickOption3();
            contrast = 4;
            onClickOption3();
        } else if (contrast === 3) {
            onClickOption3();
            contrast = 4;
            onClickOption3();
        } else if (contrast === 4) {
            onClickOption3();
        }
    }
    if (highlighLinks) {
        onClickOption4();
    }
    if (fontSize) {
        fontSize = 4;
        onClickOption5();
    }
    if (letterSpacing) {
        letterSpacing = 3;
        onClickOption6();
    }
    if (cursorOption) {
        cursorOption = 2;
        onClickOption7();
    }
    if (legibleFonts) {
        legibleFonts = 3;
        onClickOption8();
    }
    const assistIcon = document.getElementById('widget-main-icon-div-icon');
    assistIcon.src = 'https://citywebassist.blob.core.windows.net/frontendicons/front_end_icon_assests/assist-icon.png';
}

var onClickOption10 = (action) => {
    if (!action) {
        const mainContainer = document.getElementById('main-widget-container');
        mainContainer.style.display = 'none';
        const moveHideDiv = document.getElementById('main-widget-container-move');
        moveHideDiv.style.display = 'block';
    } else if (action === 'cancel') {
        const mainContainer = document.getElementById('main-widget-container');
        mainContainer.style.display = 'block';
        const moveHideDiv = document.getElementById('main-widget-container-move');
        moveHideDiv.style.display = 'none';
    } else if (action === 'apply') {
        const availOptions = Array.from(document.getElementsByName('widget-option-radio-button'))
            .filter(item => item.checked === true);
        applyMoveWidget(availOptions[0].value);
    }
}

var applyMoveWidget = (value) => {
    const getWindow = document.getElementById('widget-window');
    const mainContainer = document.getElementById('widget-main-div-both-container');
    const hideUnhideWidget = document.getElementById('hide');

    if (value === 'widget-option-top-left') {
        getWindow.style.justifyContent = 'flex-start';
        // getWindow.style.width = '452px !important';
        getWindow.style.right = 'auto';
        getWindow.style.bottom = 'auto';

        mainContainer.style.flexDirection = 'row-reverse';
        mainContainer.style.alignItems = 'flex-start';

        hideUnhideWidget.style.marginLeft = '80px';

        selectedPosition = 1;
    } else if (value === 'widget-option-top-right') {
        if (selectedPosition !== 0) {
            // getWindow.style.justifyContent = 'flex-end';
            // getWindow.style.width = '100%';
            getWindow.style.right = 2;
            getWindow.style.bottom = 'auto';

            mainContainer.style.flexDirection = 'row';
            mainContainer.style.alignItems = 'flex-start';

            hideUnhideWidget.style.marginLeft = '-20px';

            selectedPosition = 2;
        }
    } else if (value === 'widget-option-bottom-left') {
        getWindow.style.right = 'auto';
        getWindow.style.bottom = 2;

        mainContainer.style.flexDirection = 'row-reverse';
        mainContainer.style.alignItems = 'flex-end';

        hideUnhideWidget.style.marginLeft = '80px';

        selectedPosition = 3;
    } else if (value === 'widget-option-bottom-right') {
        getWindow.style.bottom = '2px';
        getWindow.style.right = '2px';

        mainContainer.style.alignItems = 'flex-end';

        selectedPosition = 4;
    }

}

var onChangeMoveOption = (event) => {
    const value = event.target.value;
    if (value === 'widget-option-top-left') {
        // const radio1 = document.get
    }
}

var onClickOption11 = () => {
    openModal();
}

var togglePageStructureTab = (tab) => {
    if (pageStructureTab !== tab) {
        pageStructureTab = tab;
        if (tab === 0) {
            const currentTab = document.getElementById('widget-modal-header-tabs-1');
            const tempTab = {
                color: currentTab.style.color,
                backgroundColor: currentTab.style.backgroundColor
            };

            const otherTab = document.getElementById('widget-modal-header-tabs-2');

            currentTab.style.backgroundColor = otherTab.style.backgroundColor;
            currentTab.style.color = otherTab.style.color;

            otherTab.style.backgroundColor = tempTab.backgroundColor;
            otherTab.style.color = tempTab.color;

            const tab1Div = document.getElementById('widget-modal-header-tabs-1-content');
            const tab2Div = document.getElementById('widget-modal-header-tabs-2-content');
            tab1Div.style.display = 'flex';
            tab2Div.style.display = 'none';

            fetchAllHeadings();
        } else {
            const currentTab = document.getElementById('widget-modal-header-tabs-2');
            const tempTab = {
                color: currentTab.style.color,
                backgroundColor: currentTab.style.backgroundColor
            };

            const otherTab = document.getElementById('widget-modal-header-tabs-1');

            currentTab.style.backgroundColor = otherTab.style.backgroundColor;
            currentTab.style.color = otherTab.style.color;

            otherTab.style.backgroundColor = tempTab.backgroundColor;
            otherTab.style.color = tempTab.color;

            const tab1Div = document.getElementById('widget-modal-header-tabs-1-content');
            const tab2Div = document.getElementById('widget-modal-header-tabs-2-content');
            tab2Div.style.display = 'flex';
            tab1Div.style.display = 'none';

            fetchAllLinks();
        }
    }
}

var scrollToElement = (elem) => {
    openModal();
    elem.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
}

var onClickLink = (elem) => {
    openModal();
    // elem.click();
    if (elem.href) {
        window.open(
            elem.href, "_blank");
    }
    // elem.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
}

var fetchAllHeadings = () => {
    if (!fetchAllHeadingsFlag) {
        const contentDiv = document.getElementById('widget-modal-header-tabs-1-content');
        const allElems = Array.from(document.querySelectorAll('*'));
        const allHeadings = allElems.filter(item => {
            const tag = item.tagName.toString().toLowerCase();
            if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
                return true;
            }
            return false;
        })

        const leftSpacing = {
            'H1': 0,
            'H2': '10px',
            'H3': '20px',
            'H4': '30px',
            'H5': '40px',
            'H6': '50px',
        };

        allHeadings.map((eachItem, index) => {
            const eachDiv = document.createElement("div");
            eachDiv.id = 'widget-modal-header-tabs-content-each-heading';
            eachDiv.style.display = 'flex';
            eachDiv.style.marginLeft = leftSpacing[eachItem.tagName];
            eachDiv.style.cursor = 'pointer';
            if (index > 0) {
                eachDiv.style.marginTop = '10px';
            }

            eachDiv.onclick = function () {
                scrollToElement(eachItem);
            };

            const eachDivIconDiv = document.createElement("div");
            eachDivIconDiv.id = 'widget-modal-header-tabs-content-each-heading-icon-div';
            eachDivIconDiv.style.display = 'flex';
            eachDivIconDiv.style.fontSize = '12px !important';
            eachDivIconDiv.style.fontWeight = '400';
            eachDivIconDiv.style.textTransform = 'uppercase';
            eachDivIconDiv.style.background = '#1e242a';
            eachDivIconDiv.style.opacity = '0.8';
            eachDivIconDiv.style.borderRadius = '5px';
            eachDivIconDiv.style.alignItems = 'center';
            eachDivIconDiv.style.justifyContent = 'center';
            eachDivIconDiv.style.alignSelf = 'center';
            eachDivIconDiv.style.height = '27px';
            eachDivIconDiv.style.width = '30px';
            eachDiv.style.cursor = 'pointer';

            const eachDivIconText = document.createElement("p");
            eachDivIconText.id = 'widget-modal-header-tabs-content-each-heading-icon';
            eachDivIconText.style.color = '#ffffff';
            eachDivIconText.style.margin = '0 8px';
            eachDiv.style.cursor = 'pointer';

            const eachDivIconTextData = document.createTextNode(eachItem.tagName);
            eachDivIconTextData.id = 'widget-modal-header-tabs-content-each-heading-icon';
            eachDiv.style.cursor = 'pointer';

            eachDivIconText.appendChild(eachDivIconTextData);   //appended text to the heading icon
            eachDivIconDiv.appendChild(eachDivIconText);        //appended icon with text inside in first div

            const eachDivTextDiv = document.createElement("div");
            eachDivTextDiv.id = 'widget-modal-header-tabs-content-each-heading-text-div';
            eachDivTextDiv.style.display = 'flex';
            eachDivTextDiv.style.fontSize = '13px!important';
            eachDivTextDiv.style.alignItems = 'center';
            eachDivTextDiv.style.height = 'auto';
            eachDiv.style.cursor = 'pointer';

            const eachDivTextText = document.createElement("p");
            eachDivTextText.id = 'widget-modal-header-tabs-content-each-heading-text';
            eachDivTextText.style.color = '#006dd5';
            eachDivTextText.style.margin = '0';
            eachDivTextText.style.marginLeft = '10px';
            eachDiv.style.cursor = 'pointer';

            const eachDivTextTextData = document.createTextNode(eachItem.innerText);
            eachDivTextTextData.id = 'widget-modal-header-tabs-content-each-heading-text';
            eachDiv.style.cursor = 'pointer';

            eachDivTextText.appendChild(eachDivTextTextData);   //appended text to the heading icon
            eachDivTextDiv.appendChild(eachDivTextText);        //appended icon with text inside in second div

            eachDiv.appendChild(eachDivIconDiv);                //appended first div to each row div
            eachDiv.appendChild(eachDivTextDiv);                //appended first div to each row div

            contentDiv.appendChild(eachDiv);
        })
        fetchAllHeadingsFlag = true;
    }
}

var fetchAllLinks = () => {
    if (!fetchAllLinksFlag) {
        const contentDiv = document.getElementById('widget-modal-header-tabs-2-content');
        const allElems = Array.from(document.querySelectorAll('a'));

        allElems.map((eachItem, index) => {
            const eachDiv = document.createElement("div");
            eachDiv.id = 'widget-modal-header-tabs-content-each-heading';
            eachDiv.style.display = 'flex';
            eachDiv.style.cursor = 'pointer';
            if (index > 0) {
                eachDiv.style.marginTop = '10px';
            }

            eachDiv.onclick = function () {
                onClickLink(eachItem);
            };

            const eachDivIconDiv = document.createElement("div");
            eachDivIconDiv.id = 'widget-modal-header-tabs-content-each-heading-icon-div';
            eachDivIconDiv.style.display = 'flex';
            eachDivIconDiv.style.fontSize = '12px !important';
            eachDivIconDiv.style.fontWeight = '400';
            eachDivIconDiv.style.textTransform = 'uppercase';
            eachDivIconDiv.style.background = '#1e242a';
            eachDivIconDiv.style.opacity = '0.8';
            eachDivIconDiv.style.borderRadius = '5px';
            eachDivIconDiv.style.alignItems = 'center';
            eachDivIconDiv.style.justifyContent = 'center';
            eachDivIconDiv.style.alignSelf = 'center';
            eachDivIconDiv.style.height = '27px';
            eachDivIconDiv.style.width = '30px';
            eachDiv.style.cursor = 'pointer';

            const eachDivIconText = document.createElement("p");
            eachDivIconText.id = 'widget-modal-header-tabs-content-each-heading-icon';
            eachDivIconText.style.color = '#ffffff';
            eachDivIconText.style.margin = '0 8px';
            eachDiv.style.cursor = 'pointer';

            const eachDivIconTextData = document.createTextNode(eachItem.tagName);
            eachDivIconTextData.id = 'widget-modal-header-tabs-content-each-heading-icon';
            eachDiv.style.cursor = 'pointer';

            eachDivIconText.appendChild(eachDivIconTextData);   //appended text to the heading icon
            eachDivIconDiv.appendChild(eachDivIconText);        //appended icon with text inside in first div

            const eachDivTextDiv = document.createElement("div");
            eachDivTextDiv.id = 'widget-modal-header-tabs-content-each-heading-text-div';
            eachDivTextDiv.style.display = 'flex';
            eachDivTextDiv.style.fontSize = '13px!important';
            eachDivTextDiv.style.alignItems = 'center';
            eachDivTextDiv.style.height = 'auto';
            eachDiv.style.cursor = 'pointer';

            const eachDivTextText = document.createElement("p");
            eachDivTextText.id = 'widget-modal-header-tabs-content-each-heading-text';
            eachDivTextText.style.color = '#006dd5';
            eachDivTextText.style.margin = '0';
            eachDivTextText.style.marginLeft = '10px';
            eachDiv.style.cursor = 'pointer';

            const eachDivTextTextData = document.createTextNode(eachItem.innerText || eachItem.ariaLabel || '');
            eachDivTextTextData.id = 'widget-modal-header-tabs-content-each-heading-text';
            eachDiv.style.cursor = 'pointer';

            eachDivTextText.appendChild(eachDivTextTextData);   //appended text to the heading icon
            eachDivTextDiv.appendChild(eachDivTextText);        //appended icon with text inside in second div

            eachDiv.appendChild(eachDivIconDiv);                //appended first div to each row div
            eachDiv.appendChild(eachDivTextDiv);                //appended first div to each row div

            contentDiv.appendChild(eachDiv);
        })
        fetchAllLinksFlag = true;
    }
}