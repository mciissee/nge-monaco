// ACTIONS

/** Move Caret Left */
export const MOVE_CARRET_LEFT_ACTION = 'editor.action.moveCarretLeftAction';
/** Move Caret Right */
export const MOVE_CARRET_RIGHT_ACTION = 'editor.action.moveCarretRightAction';
/** Transpose Letters */
export const TRANSPOSE_LETTERS_ACTION = 'editor.action.transposeLetters';
/** Cut */
export const CLIPBOARD_CUT_ACTION = 'editor.action.clipboardCutAction';
/** Copy */
export const CLIPBOARD_COPY_ACTION = 'editor.action.clipboardCopyAction';
/** Copy With Syntax Highlighting */
export const CLIPBOARD_COPY_WITH_SYNTAX_HIGHLIGHTING_ACTION = 'editor.action.clipboardCopyWithSyntaxHighlightingAction';
/** Toggle Line Comment */
export const COMMENT_LINE_ACTION = 'editor.action.commentLine';
/** Add Line Comment */
export const ADD_COMMENT_LINE_ACTION = 'editor.action.addCommentLine';
/** Remove Line Comment */
export const REMOVE_COMMENT_LINE_ACTION = 'editor.action.removeCommentLine';
/** Toggle Block Comment */
export const BLOCK_COMMENT_ACTION = 'editor.action.blockComment';
/** Show Editor Context Menu */
export const SHOW_CONTEXT_MENU_ACTION = 'editor.action.showContextMenu';
/** Cursor Undo */
export const CURSOR_UNDO_ACTION = 'cursorUndo';
/** Cursor Redo */
export const CURSOR_REDO_ACTION = 'cursorRedo';
/** Editor Font Zoom In */
export const FONT_ZOOM_IN_ACTION = 'editor.action.fontZoomIn';
/** Editor Font Zoom Out */
export const FONT_ZOOM_OUT_ACTION = 'editor.action.fontZoomOut';
/** Editor Font Zoom Reset */
export const FONT_ZOOM_RESET_ACTION = 'editor.action.fontZoomReset';
/** Copy Line Up */
export const COPY_LINES_UP_ACTION = 'editor.action.copyLinesUpAction';
/** Copy Line Down */
export const COPY_LINES_DOWN_ACTION = 'editor.action.copyLinesDownAction';
/** Duplicate Selection */
export const DUPLICATE_SELECTION_ACTION = 'editor.action.duplicateSelection';
/** Move Line Up */
export const MOVE_LINES_UP_ACTION = 'editor.action.moveLinesUpAction';
/** Move Line Down */
export const MOVE_LINES_DOWN_ACTION = 'editor.action.moveLinesDownAction';
/** Sort Lines Ascending */
export const SORT_LINES_ASCENDING_ACTION = 'editor.action.sortLinesAscending';
/** Sort Lines Descending */
export const SORT_LINES_DESCENDING_ACTION = 'editor.action.sortLinesDescending';
/** Trim Trailing Whitespace */
export const TRIM_TRAILING_WHITESPACE_ACTION = 'editor.action.trimTrailingWhitespace';
/** Delete Line */
export const DELETE_LINES_ACTION = 'editor.action.deleteLines';
/** Indent Line */
export const INDENT_LINES_ACTION = 'editor.action.indentLines';
/** Outdent Line */
export const OUTDENT_LINES_ACTION = 'editor.action.outdentLines';
/** Insert Line Above */
export const INSERT_LINE_BEFORE_ACTION = 'editor.action.insertLineBefore';
/** Insert Line Below */
export const INSERT_LINE_AFTER_ACTION = 'editor.action.insertLineAfter';
/** Delete All Left */
export const DELETE_ALL_LEFT_ACTION = 'deleteAllLeft';
/** Delete All Right */
export const DELETE_ALL_RIGHT_ACTION = 'deleteAllRight';
/** Join Lines */
export const JOIN_LINES_ACTION = 'editor.action.joinLines';
/** Transpose characters around the cursor */
export const TRANSPOSE_ACTION = 'editor.action.transpose';
/** Transform to Uppercase */
export const TRANSFORM_TO_UPPERCASE_ACTION = 'editor.action.transformToUppercase';
/** Transform to Lowercase */
export const TRANSFORM_TO_LOWERCASE_ACTION = 'editor.action.transformToLowercase';
/** Transform to Title Case */
export const TRANSFORM_TO_TITLECASE_ACTION = 'editor.action.transformToTitlecase';
/** Expand Selection */
export const SMART_SELECT_EXPAND_ACTION = 'editor.action.smartSelect.expand';
/** Shrink Selection */
export const SMART_SELECT_SHRINK_ACTION = 'editor.action.smartSelect.shrink';
/** Toggle Tab Key Moves Focus */
export const TOGGLE_TAB_FOCUS_MODE_ACTION = 'editor.action.toggleTabFocusMode';
/** Developer: Force Retokenize */
export const FORCE_RETOKENIZE_ACTION = 'editor.action.forceRetokenize';
/** Toggle High Contrast Theme */
export const TOGGLE_HIGH_CONTRAST_ACTION = 'editor.action.toggleHighContrast';
/** Select to Bracket */
export const SELECT_TO_BRACKET_ACTION = 'editor.action.selectToBracket';
/** Go to Bracket */
export const JUMP_TO_BRACKET_ACTION = 'editor.action.jumpToBracket';
/** Find */
export const FIND_ACTION = 'actions.find';
/** Find With Selection */
export const FIND_WITH_SELECTION_ACTION = 'actions.findWithSelection';
/** Find Next */
export const NEXT_MATCH_FIND_ACTION = 'editor.action.nextMatchFindAction';
/** Find Previous */
export const PREVIOUS_MATCH_FIND_ACTION = 'editor.action.previousMatchFindAction';
/** Find Next Selection */
export const NEXT_SELECTION_MATCH_FIND_ACTION = 'editor.action.nextSelectionMatchFindAction';
/** Find Previous Selection */
export const PREVIOUS_SELECTION_MATCH_FIND_ACTION = 'editor.action.previousSelectionMatchFindAction';
/** Replace */
export const START_FIND_REPLACE_ACTION = 'editor.action.startFindReplaceAction';
/** Unfold */
export const UNFOLD_ACTION = 'editor.unfold';
/** Unfold Recursively */
export const UNFOLD_RECURSIVELY_ACTION = 'editor.unfoldRecursively';
/** Fold */
export const FOLD_ACTION = 'editor.fold';
/** Fold Recursively */
export const FOLD_RECURSIVELY_ACTION = 'editor.foldRecursively';
/** Fold All */
export const FOLD_ALL_ACTION = 'editor.foldAll';
/** Unfold All */
export const UNFOLD_ALL_ACTION = 'editor.unfoldAll';
/** Fold All Block Comments */
export const FOLD_ALL_BLOCK_COMMENTS_ACTION = 'editor.foldAllBlockComments';
/** Fold All Regions */
export const FOLD_ALL_MARKER_REGIONS_ACTION = 'editor.foldAllMarkerRegions';
/** Unfold All Regions */
export const UNFOLD_ALL_MARKER_REGIONS_ACTION = 'editor.unfoldAllMarkerRegions';
/** Toggle Fold */
export const TOGGLE_FOLD_ACTION = 'editor.toggleFold';
/** Fold Level 1 */
export const FOLD_LEVEL1_ACTION = 'editor.foldLevel1';
/** Fold Level 2 */
export const FOLD_LEVEL2_ACTION = 'editor.foldLevel2';
/** Fold Level 3 */
export const FOLD_LEVEL3_ACTION = 'editor.foldLevel3';
/** Fold Level 4 */
export const FOLD_LEVEL4_ACTION = 'editor.foldLevel4';
/** Fold Level 5 */
export const FOLD_LEVEL5_ACTION = 'editor.foldLevel5';
/** Fold Level 6 */
export const FOLD_LEVEL6_ACTION = 'editor.foldLevel6';
/** Fold Level 7 */
export const FOLD_LEVEL7_ACTION = 'editor.foldLevel7';
/** Replace with Previous Value */
export const IN_PLACE_REPLACE_UP_ACTION = 'editor.action.inPlaceReplace.up';
/** Replace with Next Value */
export const IN_PLACE_REPLACE_DOWN_ACTION = 'editor.action.inPlaceReplace.down';
/** Open Link */
export const OPEN_LINK_ACTION = 'editor.action.openLink';
/** Add Cursor Above */
export const INSERT_CURSOR_ABOVE_ACTION = 'editor.action.insertCursorAbove';
/** Add Cursor Below */
export const INSERT_CURSOR_BELOW_ACTION = 'editor.action.insertCursorBelow';
/** Add Cursors to Line Ends */
export const INSERT_CURSOR_AT_END_OF_EACH_LINE_SELECTED_ACTION = 'editor.action.insertCursorAtEndOfEachLineSelected';
/** Add Selection To Next Find Match */
export const ADD_SELECTION_TO_NEXT_FIND_MATCH_ACTION = 'editor.action.addSelectionToNextFindMatch';
/** Add Selection To Previous Find Match */
export const ADD_SELECTION_TO_PREVIOUS_FIND_MATCH_ACTION = 'editor.action.addSelectionToPreviousFindMatch';
/** Move Last Selection To Next Find Match */
export const MOVE_SELECTION_TO_NEXT_FIND_MATCH_ACTION = 'editor.action.moveSelectionToNextFindMatch';
/** Move Last Selection To Previous Find Match */
export const MOVE_SELECTION_TO_PREVIOUS_FIND_MATCH_ACTION = 'editor.action.moveSelectionToPreviousFindMatch';
/** Select All Occurrences of Find Match */
export const SELECT_HIGHLIGHTS_ACTION = 'editor.action.selectHighlights';
/** Add Cursors To Bottom */
export const ADD_CURSORS_TO_BOTTOM_ACTION = 'editor.action.addCursorsToBottom';
/** Add Cursors To Top */
export const ADD_CURSORS_TO_TOP_ACTION = 'editor.action.addCursorsToTop';
/** Trigger Symbol Highlight */
export const WORD_HIGHLIGHT_TRIGGER_ACTION = 'editor.action.wordHighlight.trigger';
/** Show Accessibility Help */
export const SHOW_ACCESSIBILITY_HELP_ACTION = 'editor.action.showAccessibilityHelp';
/** Developer: Inspect Tokens */
export const INSPECT_TOKENS_ACTION = 'editor.action.inspectTokens';
/** Go to Line... */
export const GOTO_LINE_ACTION = 'editor.action.gotoLine';
/** Command Palette */
export const QUICK_COMMAND_ACTION = 'editor.action.quickCommand';
/** Go to Next Problem (Error, Warning, Info) */
export const MARKER_NEXT_ACTION = 'editor.action.marker.next';
/** Go to Previous Problem (Error, Warning, Info) */
export const MARKER_PREV_ACTION = 'editor.action.marker.prev';
/** Go to Next Problem in Files (Error, Warning, Info) */
export const MARKER_NEXT_IN_FILES_ACTION = 'editor.action.marker.nextInFiles';
/** Go to Previous Problem in Files (Error, Warning, Info) */
export const MARKER_PREV_IN_FILES_ACTION = 'editor.action.marker.prevInFiles';
/** Show Hover */
export const SHOW_HOVER_ACTION = 'editor.action.showHover';
/** Show Definition Preview Hover */
export const SHOW_DEFINITION_PREVIEW_HOVER_ACTION = 'editor.action.showDefinitionPreviewHover';
/** Trigger Suggest */
export const TRIGGER_SUGGEST_ACTION = 'editor.action.triggerSuggest';



// https://github.com/microsoft/vscode/tree/master/src/vs/editor/contrib

export const COLOR_DETECTOR_CONTRIB = 'editor.contrib.colorDetector';
export const CONTEXT_MENU_CONTRIB = 'editor.contrib.contextmenu';
export const CURSOR_UNDO_REDO_CONTROLLER_CONTRIB = 'editor.contrib.cursorUndoRedoController';
export const DRAG_AND_DROP_CONTRIB = 'editor.contrib.dragAndDrop';
export const AUTO_FORMAT_CONTRIB = 'editor.contrib.autoFormat';
export const FORMAT_ON_PAST_CONTRIB = 'editor.contrib.formatOnPaste';
export const SMART_SELECT_CONTRIB = 'editor.contrib.smartSelectController';
export const IPAD_SHOW_KEYBOARD_CONTRIB = 'editor.contrib.iPadShowKeyboard';
export const BRACKET_MATCHING_CONTROLLER_CONTRIB = 'editor.contrib.bracketMatchingController';
export const CODE_LENS_CONTRIB = 'css.editor.codeLens';
export const FIND_CONTROLLE_CONTRIB = 'editor.contrib.findController';
export const FOLDING_CONTRIB = 'editor.contrib.folding';
export const IN_PLACE_REPLACE_CONTROLLER_CONTRIB = 'editor.contrib.inPlaceReplaceController';
export const LINK_DETECTOR_CONTRIB = 'editor.linkDetector';
export const MESSAGE_CONTROLLER_CONTRIB = 'editor.contrib.messageController';
export const QUICK_FIX_CONTROLLER_CONTRIB = 'editor.contrib.quickFixController';
export const MULTI_CURSOR_CONTROLLER_CONTRIB = 'editor.contrib.multiCursorController';
export const SELECTION_HIGHLIGHTER_CONTRIB = 'editor.contrib.selectionHighlighter';
export const PARAMETER_HINTS_CONTRIB = 'editor.controller.parameterHints';
export const REFERENCE_CONTROLLER_CONTRIB = 'editor.contrib.referenceController';
export const RENAME_CONTROLLER_CONTRIB = 'editor.contrib.renameController';
export const WORD_HIGHLIGHTER_CONTRIB = 'editor.contrib.wordHighlighter';
export const ACCESSIBILIY_HELP_CONTROLLER_CONTRIB = 'editor.contrib.accessibilityHelpController';
export const INSPECT_TOKENS_CONTRIB = 'editor.contrib.inspectTokens';
export const QUICK_OPEN_CONTROLLER_CONTRIB = 'editor.controller.quickOpenController';
export const GOTO_DEFINITION_CONTRIB = 'editor.contrib.gotodefinitionatposition';
export const REFERENCES_CONTROLLER_CONTRIB = 'editor.contrib.referencesController';
export const MARKER_CONTROLLER_CONTRIB = 'editor.contrib.markerController';
export const HOVER_CONTRIB = 'editor.contrib.hover';
export const SNIPPET_CONTROLLER_CONTRIB = 'snippetController2';
export const SUGGEST_CONTROLLER_CONTRIB = 'editor.contrib.suggestController';
