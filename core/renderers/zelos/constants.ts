/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Former goog.module ID: Blockly.zelos.ConstantProvider

import {ConnectionType} from '../../connection_type.js';
import type {RenderedConnection} from '../../rendered_connection.js';
import type {Theme} from '../../theme.js';
import * as utilsColour from '../../utils/colour.js';
import * as dom from '../../utils/dom.js';
import {Svg} from '../../utils/svg.js';
import * as svgPaths from '../../utils/svg_paths.js';
import type {Shape} from '../common/constants.js';
import {ConstantProvider as BaseConstantProvider} from '../common/constants.js';
import type {Padding} from './info.js';

/** An object containing sizing and path information about inside corners. */
export interface InsideCorners {
  width: number;
  height: number;
  pathTop: string;
  pathBottom: string;
  rightWidth: number;
  rightHeight: number;
  pathTopRight: string;
  pathBottomRight: string;
}

/**
 * An object that provides constants for rendering blocks in Zelos mode.
 */
export class ConstantProvider extends BaseConstantProvider {
  GRID_UNIT = 4;
  STATEMENT_INPUT_SPACER_MIN_WIDTH: number;

  override CURSOR_COLOUR = '#ffa200';

  /**
   * Radius of the cursor for input and output connections.
   */
  CURSOR_RADIUS = 5;

  override JAGGED_TEETH_HEIGHT = 0;

  override JAGGED_TEETH_WIDTH = 0;
  override START_HAT_HEIGHT = 22;

  override START_HAT_WIDTH = 96;

  override SHAPES = {
    HEXAGONAL: 1,
    ROUND: 2,
    SQUARE: 3,
    PILLOW: 4,
    BOWL: 5,
    SPIKEY: 6,
    PUZZLE: 7,
    NOTCH: 8,
  };

  /**
   * Map of output/input shapes and the amount they should cause a block to be
   * padded. Outer key is the outer shape, inner key is the inner shape.
   * When a block with the outer shape contains an input block with the inner
   * shape on its left or right edge, the block elements are aligned such that
   * the padding specified is reached.
   */
  SHAPE_IN_SHAPE_PADDING: {[key: number]: {[key: number]: Padding}} = {
    1: {
      // Outer shape: hexagon.
      0: 5 * this.GRID_UNIT, // Field in hexagon.
      1: 2 * this.GRID_UNIT, // Hexagon in hexagon.
      2: 5 * this.GRID_UNIT, // Round in hexagon.
      3: 5 * this.GRID_UNIT, // Square in hexagon.
      4: 4 * this.GRID_UNIT, // Pillow in hexagon.
      5: {left: 5 * this.GRID_UNIT, right: 3 * this.GRID_UNIT}, // Bowl in hexagon.
      6: 5 * this.GRID_UNIT, // Spikey in hexagon.
    },
    2: {
      // Outer shape: round.
      0: 3 * this.GRID_UNIT, // Field in round.
      1: 3 * this.GRID_UNIT, // Hexagon in round.
      2: 1 * this.GRID_UNIT, // Round in round.
      3: 4 * this.GRID_UNIT, // Square in round.
      4: 2 * this.GRID_UNIT, // Pillow in round.
      5: {left: 8 * this.GRID_UNIT, right: 1 * this.GRID_UNIT}, // Bowl in round.
      6: {left: 8 * this.GRID_UNIT, right: 1 * this.GRID_UNIT}, // Spikey in round.
    },
    3: {
      // Outer shape: square.
      0: 2 * this.GRID_UNIT, // Field in square.
      1: 1 * this.GRID_UNIT, // Hexagon in square.
      2: 1 * this.GRID_UNIT, // Round in square.
      3: 1 * this.GRID_UNIT, // Square in square.
      4: 1 * this.GRID_UNIT, // Pillow in square.
      5: 1 * this.GRID_UNIT, // Bowl in square.
      6: 1 * this.GRID_UNIT, // Spikey in square.
    },
    4: {
      // Outer shape: pillow
      0: 4 * this.GRID_UNIT, // Field in pillow.
      1: 3 * this.GRID_UNIT, // Hexagon in pillow.
      2: 3 * this.GRID_UNIT, // Round in pillow.
      3: 4 * this.GRID_UNIT, // Square in pillow.
      4: 2 * this.GRID_UNIT, // Pillow in pillow.
      5: 5 * this.GRID_UNIT, // Bowl in pillow.
      6: 5 * this.GRID_UNIT, // Spikey in pillow.
    },
    5: {
      // Outer shape: bowl.
      0: 4 * this.GRID_UNIT, // Field in bowl.
      1: {left: 4 * this.GRID_UNIT, right: 2 * this.GRID_UNIT}, // Hexagon in bowl.
      2: {left: 4 * this.GRID_UNIT, right: 1 * this.GRID_UNIT}, // Round in bowl.
      3: {left: 4 * this.GRID_UNIT, right: 5 * this.GRID_UNIT}, // Square in bowl.
      4: {left: 4 * this.GRID_UNIT, right: 2 * this.GRID_UNIT}, // Pillow in bowl.
      5: {left: 1.5 * this.GRID_UNIT, right: 1 * this.GRID_UNIT}, // Bowl in bowl.
      6: {left: 3 * this.GRID_UNIT, right: 1 * this.GRID_UNIT}, // Spikey in bowl.
    },
    6: {
      // Outer shape: spikey.
      0: 4 * this.GRID_UNIT, // Field in spikey.
      1: {left: 4 * this.GRID_UNIT, right: 2 * this.GRID_UNIT}, // Hexagon in spikey.
      2: {left: 4 * this.GRID_UNIT, right: 1 * this.GRID_UNIT}, // Round in spikey.
      3: {left: 4 * this.GRID_UNIT, right: 5 * this.GRID_UNIT}, // Square in spikey.
      4: {left: 4 * this.GRID_UNIT, right: 2 * this.GRID_UNIT}, // Pillow in spikey.
      5: {left: 4 * this.GRID_UNIT, right: 1 * this.GRID_UNIT}, // Bowl in spikey.
      6: {left: 3 * this.GRID_UNIT, right: 1 * this.GRID_UNIT}, // Spikey in spikey.
    },
  };

  override FULL_BLOCK_FIELDS = true;

  override FIELD_TEXT_FONTWEIGHT = 'bold';

  override FIELD_TEXT_FONTFAMILY =
    '"Helvetica Neue", "Segoe UI", Helvetica, sans-serif';

  override FIELD_DROPDOWN_NO_BORDER_RECT_SHADOW = true;

  override FIELD_DROPDOWN_COLOURED_DIV = true;

  override FIELD_DROPDOWN_SVG_ARROW = true;
  override FIELD_TEXTINPUT_BOX_SHADOW = true;

  override FIELD_COLOUR_FULL_BLOCK = true;
  MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH: number;

  /** The selected glow colour. */
  SELECTED_GLOW_COLOUR = '#fff200';

  /** The size of the selected glow. */
  SELECTED_GLOW_SIZE = 0.5;

  /** The replacement glow colour. */
  REPLACEMENT_GLOW_COLOUR = '#fff200';

  /** The size of the selected glow. */
  REPLACEMENT_GLOW_SIZE = 2;

  /**
   * The ID of the selected glow filter, or the empty string if no filter is
   * set.
   */
  selectedGlowFilterId = '';

  /**
   * The <filter> element to use for a selected glow, or null if not set.
   */
  private selectedGlowFilter: SVGElement | null = null;

  /**
   * The ID of the replacement glow filter, or the empty string if no filter
   * is set.
   */
  replacementGlowFilterId = '';

  /**
   * The <filter> element to use for a replacement glow, or null if not set.
   */
  private replacementGlowFilter: SVGElement | null = null;

  /**
   * The object containing information about the hexagon used for a boolean
   * reporter block. Null before init is called.
   */
  HEXAGONAL: Shape | null = null;

  /**
   * The object containing information about the hexagon used for a number or
   * string reporter block. Null before init is called.
   */
  ROUNDED: Shape | null = null;

  /**
   * The object containing information about the hexagon used for a
   * rectangular reporter block. Null before init is called.
   */
  SQUARED: Shape | null = null;

  /**
   * The object containing information about the hexagon used for an object
   * reporter block. Null before init is called.
   */
  PILLOW: Shape | null = null;

  /**
   * The object containing information about the hexagon used for a list
   * reporter block. Null before init is called.
   */
  BOWL: Shape | null = null;

  /**
   * The object containing information about the spikey shape for set
   * reporter blocks. Null before init is called.
   */
  SPIKEY: Shape | null = null;

  /**
   * Creates a new ConstantProvider.
   *
   * @param gridUnit If set, defines the base unit used to calculate other
   *     constants.
   */
  constructor(gridUnit?: number) {
    super();

    if (gridUnit) {
      this.GRID_UNIT = gridUnit;
    }

    this.SMALL_PADDING = this.GRID_UNIT;

    this.MEDIUM_PADDING = 2 * this.GRID_UNIT;

    this.MEDIUM_LARGE_PADDING = 3 * this.GRID_UNIT;

    this.LARGE_PADDING = 4 * this.GRID_UNIT;

    this.CORNER_RADIUS = 1 * this.GRID_UNIT;

    this.NOTCH_WIDTH = 9 * this.GRID_UNIT;

    this.NOTCH_HEIGHT = 2 * this.GRID_UNIT;

    this.NOTCH_OFFSET_LEFT = 3 * this.GRID_UNIT;

    this.STATEMENT_INPUT_NOTCH_OFFSET = this.NOTCH_OFFSET_LEFT;

    this.MIN_BLOCK_WIDTH = 2 * this.GRID_UNIT;

    this.MIN_BLOCK_HEIGHT = 12 * this.GRID_UNIT;

    this.EMPTY_STATEMENT_INPUT_HEIGHT = 6 * this.GRID_UNIT;

    this.TOP_ROW_MIN_HEIGHT = this.CORNER_RADIUS;

    this.TOP_ROW_PRECEDES_STATEMENT_MIN_HEIGHT = this.LARGE_PADDING;

    this.BOTTOM_ROW_MIN_HEIGHT = this.CORNER_RADIUS;

    this.BOTTOM_ROW_AFTER_STATEMENT_MIN_HEIGHT = 6 * this.GRID_UNIT;

    this.STATEMENT_BOTTOM_SPACER = -this.NOTCH_HEIGHT;

    /** Minimum statement input spacer width. */
    this.STATEMENT_INPUT_SPACER_MIN_WIDTH = 40 * this.GRID_UNIT;

    this.STATEMENT_INPUT_PADDING_LEFT = 4 * this.GRID_UNIT;

    this.EMPTY_INLINE_INPUT_PADDING = 4 * this.GRID_UNIT;

    this.EMPTY_INLINE_INPUT_HEIGHT = 8 * this.GRID_UNIT;

    this.DUMMY_INPUT_MIN_HEIGHT = 8 * this.GRID_UNIT;

    this.DUMMY_INPUT_SHADOW_MIN_HEIGHT = 6 * this.GRID_UNIT;

    this.CURSOR_WS_WIDTH = 20 * this.GRID_UNIT;

    this.FIELD_TEXT_FONTSIZE = 3 * this.GRID_UNIT;

    this.FIELD_BORDER_RECT_RADIUS = this.CORNER_RADIUS;

    this.FIELD_BORDER_RECT_X_PADDING = 2 * this.GRID_UNIT;

    this.FIELD_BORDER_RECT_Y_PADDING = 1.625 * this.GRID_UNIT;

    this.FIELD_BORDER_RECT_HEIGHT = 8 * this.GRID_UNIT;

    this.FIELD_DROPDOWN_BORDER_RECT_HEIGHT = 8 * this.GRID_UNIT;

    this.FIELD_DROPDOWN_SVG_ARROW_PADDING = this.FIELD_BORDER_RECT_X_PADDING;

    this.FIELD_COLOUR_DEFAULT_WIDTH = 6 * this.GRID_UNIT;

    this.FIELD_COLOUR_DEFAULT_HEIGHT = 8 * this.GRID_UNIT;

    this.FIELD_CHECKBOX_X_OFFSET = 1 * this.GRID_UNIT;

    /** The maximum width of a dynamic connection shape. */
    this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH = 8 * this.GRID_UNIT;
  }

  override setFontConstants_(theme: Theme) {
    super.setFontConstants_(theme);

    this.FIELD_BORDER_RECT_HEIGHT =
      this.FIELD_TEXT_HEIGHT + this.FIELD_BORDER_RECT_Y_PADDING * 2;
    this.FIELD_DROPDOWN_BORDER_RECT_HEIGHT = this.FIELD_BORDER_RECT_HEIGHT;
  }

  override init() {
    super.init();
    this.HEXAGONAL = this.makeHexagonal();
    this.ROUNDED = this.makeRounded();
    this.SQUARED = this.makeSquared();
    this.PILLOW = this.makePillow();
    this.BOWL = this.makeBowl();
    this.SPIKEY = this.makeSpikey();

    this.STATEMENT_INPUT_NOTCH_OFFSET =
      this.NOTCH_OFFSET_LEFT +
      (this.INSIDE_CORNERS as InsideCorners).rightWidth;
  }

  override setDynamicProperties_(theme: Theme) {
    super.setDynamicProperties_(theme);

    this.SELECTED_GLOW_COLOUR =
      theme.getComponentStyle('selectedGlowColour') ||
      this.SELECTED_GLOW_COLOUR;
    const selectedGlowSize = Number(
      theme.getComponentStyle('selectedGlowSize'),
    );
    this.SELECTED_GLOW_SIZE =
      selectedGlowSize && !isNaN(selectedGlowSize)
        ? selectedGlowSize
        : this.SELECTED_GLOW_SIZE;
    this.REPLACEMENT_GLOW_COLOUR =
      theme.getComponentStyle('replacementGlowColour') ||
      this.REPLACEMENT_GLOW_COLOUR;
    const replacementGlowSize = Number(
      theme.getComponentStyle('replacementGlowSize'),
    );
    this.REPLACEMENT_GLOW_SIZE =
      replacementGlowSize && !isNaN(replacementGlowSize)
        ? replacementGlowSize
        : this.REPLACEMENT_GLOW_SIZE;
  }

  override dispose() {
    super.dispose();
    if (this.selectedGlowFilter) {
      dom.removeNode(this.selectedGlowFilter);
    }
    if (this.replacementGlowFilter) {
      dom.removeNode(this.replacementGlowFilter);
    }
  }

  override makeStartHat() {
    const height = this.START_HAT_HEIGHT;
    const width = this.START_HAT_WIDTH;

    const mainPath = svgPaths.curve('c', [
      svgPaths.point(25, -height),
      svgPaths.point(71, -height),
      svgPaths.point(width, 0),
    ]);
    // Height is actually the Y position of the control points defining the
    // curve of the hat; the hat's actual rendered height is 3/4 of the control
    // points' Y position, per https://stackoverflow.com/a/5327329
    return {height: height * 0.75, width, path: mainPath};
  }

  /**
   * Create sizing and path information about a hexagonal shape.
   *
   * @returns An object containing sizing and path information about a hexagonal
   *     shape for connections.
   */
  protected makeHexagonal(): Shape {
    const maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;

    /**
     * Make the main path for the hexagonal connection shape out of two lines.
     * The lines are defined with relative positions and require the block
     * height. The 'up' and 'down' versions of the paths are the same, but the Y
     * sign flips.  The 'left' and 'right' versions of the path are also the
     * same, but the X sign flips.
     *
     * @param height The height of the block the connection is on.
     * @param up True if the path should be drawn from bottom to top, false
     *     otherwise.
     * @param right True if the path is for the right side of the block.
     * @returns A path fragment describing a rounded connection.
     */
    function makeMainPath(height: number, up: boolean, right: boolean): string {
      const halfHeight = height / 2;
      const width = halfHeight > maxWidth ? maxWidth : halfHeight;
      const forward = up ? -1 : 1;
      const direction = right ? -1 : 1;
      const dy = (forward * height) / 2;
      return (
        svgPaths.lineTo(-direction * width, dy) +
        svgPaths.lineTo(direction * width, dy)
      );
    }

    return {
      type: this.SHAPES.HEXAGONAL,
      isDynamic: true,
      width(height: number): number {
        const halfHeight = height / 2;
        return halfHeight > maxWidth ? maxWidth : halfHeight;
      },
      height(height: number): number {
        return height;
      },
      connectionOffsetY(connectionHeight: number): number {
        return connectionHeight / 2;
      },
      connectionOffsetX(connectionWidth: number): number {
        return -connectionWidth;
      },
      pathDown(height: number): string {
        return makeMainPath(height, false, false);
      },
      pathUp(height: number): string {
        return makeMainPath(height, true, false);
      },
      pathRightDown(height: number): string {
        return makeMainPath(height, false, true);
      },
      pathRightUp(height: number): string {
        return makeMainPath(height, false, true);
      },
    };
  }

  /**
   * Create sizing and path information about a rounded shape.
   *
   * @returns An object containing sizing and path information about a rounded
   *     shape for connections.
   */
  protected makeRounded(): Shape {
    const maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
    const maxHeight = maxWidth * 2;

    /**
     * Make the main path for the rounded connection shape out of two arcs and
     * a line that joins them.  The arcs are defined with relative positions.
     * Usually, the height of the block is split between the two arcs. In the
     * case where the height of the block exceeds the maximum height, a line is
     * drawn in between the two arcs. The 'up' and 'down' versions of the paths
     * are the same, but the Y sign flips.  The 'up' and 'right' versions of the
     * path flip the sweep-flag which moves the arc at negative angles.
     *
     * @param blockHeight The height of the block the connection is on.
     * @param up True if the path should be drawn from bottom to top, false
     *     otherwise.
     * @param right True if the path is for the right side of the block.
     * @returns A path fragment describing a rounded connection.
     */
    function makeMainPath(
      blockHeight: number,
      up: boolean,
      right: boolean,
    ): string {
      const remainingHeight =
        blockHeight > maxHeight ? blockHeight - maxHeight : 0;
      const height = blockHeight > maxHeight ? maxHeight : blockHeight;
      const radius = height / 2;
      const sweep = right === up ? '0' : '1';
      return (
        svgPaths.arc(
          'a',
          '0 0,' + sweep,
          radius,
          svgPaths.point((right ? 1 : -1) * radius, (up ? -1 : 1) * radius),
        ) +
        svgPaths.lineOnAxis('v', (up ? -1 : 1) * remainingHeight) +
        svgPaths.arc(
          'a',
          '0 0,' + sweep,
          radius,
          svgPaths.point((right ? -1 : 1) * radius, (up ? -1 : 1) * radius),
        )
      );
    }

    return {
      type: this.SHAPES.ROUND,
      isDynamic: true,
      width(height: number): number {
        const halfHeight = height / 2;
        return halfHeight > maxWidth ? maxWidth : halfHeight;
      },
      height(height: number): number {
        return height;
      },
      connectionOffsetY(connectionHeight: number): number {
        return connectionHeight / 2;
      },
      connectionOffsetX(connectionWidth: number): number {
        return -connectionWidth;
      },
      pathDown(height: number): string {
        return makeMainPath(height, false, false);
      },
      pathUp(height: number): string {
        return makeMainPath(height, true, false);
      },
      pathRightDown(height: number): string {
        return makeMainPath(height, false, true);
      },
      pathRightUp(height: number): string {
        return makeMainPath(height, false, true);
      },
    };
  }

  /**
   * Create sizing and path information about a squared shape.
   *
   * @returns An object containing sizing and path information about a squared
   *     shape for connections.
   */
  protected makeSquared(): Shape {
    const radius = this.CORNER_RADIUS;

    /**
     * Make the main path for the squared connection shape out of two corners
     * and a single line in-between (a and v). These are defined in relative
     * positions and require the height of the block.
     * The 'left' and 'right' versions of the paths are the same, but the Y sign
     * flips.  The 'up' and 'down' versions of the path determine where the
     * corner point is placed and in turn the direction of the corners.
     *
     * @param height The height of the block the connection is on.
     * @param up True if the path should be drawn from bottom to top, false
     *     otherwise.
     * @param right True if the path is for the right side of the block.
     * @returns A path fragment describing a squared connection.
     */
    function makeMainPath(height: number, up: boolean, right: boolean): string {
      const innerHeight = height - radius * 2;
      const sweep = right === up ? '0' : '1';
      return (
        svgPaths.arc(
          'a',
          '0 0,' + sweep,
          radius,
          svgPaths.point((right ? 1 : -1) * radius, (up ? -1 : 1) * radius),
        ) +
        svgPaths.lineOnAxis('v', (up ? -1 : 1) * innerHeight) +
        svgPaths.arc(
          'a',
          '0 0,' + sweep,
          radius,
          svgPaths.point((right ? -1 : 1) * radius, (up ? -1 : 1) * radius),
        )
      );
    }

    return {
      type: this.SHAPES.SQUARE,
      isDynamic: true,
      width(_height: number): number {
        return radius;
      },
      height(height: number): number {
        return height;
      },
      connectionOffsetY(connectionHeight: number): number {
        return connectionHeight / 2;
      },
      connectionOffsetX(connectionWidth: number): number {
        return -connectionWidth;
      },
      pathDown(height: number): string {
        return makeMainPath(height, false, false);
      },
      pathUp(height: number): string {
        return makeMainPath(height, true, false);
      },
      pathRightDown(height: number): string {
        return makeMainPath(height, false, true);
      },
      pathRightUp(height: number): string {
        return makeMainPath(height, false, true);
      },
    };
  }

  /**
   * Create sizing and path information about a pillow-like shape.
   *
   * @returns An object containing sizing and path information about a pillow-like
   *     shape for connections.
   */
  protected makePillow(): Shape {
    const maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
    const maxHeight = maxWidth * 2;

    /**
     * @param height The height of the block the connection is on.
     * @param up True if the path should be drawn from bottom to top, false
     *     otherwise.
     * @param right True if the path is for the right side of the block.
     * @returns A path fragment describing a pillow-like connection.
     */
    function makeMainPath(height: number, up: boolean, right: boolean) {
      const extra = height > maxHeight ? height - maxHeight : 0;
      const _height = height > maxHeight ? maxHeight : height;
      const radius = _height / 8;

      const dirRight = right ? 1 : -1;
      const dirUp = up ? -1 : 1;

      const radiusW = radius * dirRight;
      const radiusH = radius * dirUp;

      return (
        svgPaths.lineOnAxis('h', radiusW) +
        svgPaths.curve('q', [
          svgPaths.point(radiusW, 0),
          svgPaths.point(radiusW, radiusH),
        ]) +
        svgPaths.curve('q', [
          svgPaths.point(0, radiusH),
          svgPaths.point(radiusW, radiusH),
        ]) +
        svgPaths.curve('q', [
          svgPaths.point(radiusW, 0),
          svgPaths.point(radiusW, radiusH),
        ]) +
        svgPaths.lineOnAxis('v', (extra + _height - radius * 6) * dirUp) +
        svgPaths.curve('q', [
          svgPaths.point(0, radiusH),
          svgPaths.point(-radiusW, radiusH),
        ]) +
        svgPaths.curve('q', [
          svgPaths.point(-radiusW, 0),
          svgPaths.point(-radiusW, radiusH),
        ]) +
        svgPaths.curve('q', [
          svgPaths.point(0, radiusH),
          svgPaths.point(-radiusW, radiusH),
        ]) +
        svgPaths.lineOnAxis('h', -radiusW)
      );
    }

    return {
      type: this.SHAPES.PILLOW,
      isDynamic: true,
      width(height: number): number {
        const halfHeight = height / 2;
        return halfHeight > maxWidth ? maxWidth : halfHeight;
      },
      height(height: number): number {
        return height;
      },
      connectionOffsetY(connectionHeight: number): number {
        return connectionHeight / 2;
      },
      connectionOffsetX(connectionWidth: number): number {
        return -connectionWidth;
      },
      pathDown(height: number) {
        return makeMainPath(height, false, false);
      },
      pathUp(height: number) {
        return makeMainPath(height, true, false);
      },
      pathRightDown(height: number) {
        return makeMainPath(height, false, true);
      },
      pathRightUp(height: number) {
        return makeMainPath(height, false, true);
      },
    };
  }

  /**
   * Create sizing and path information about a bowl shape.
   *
   * @returns An object containing sizing and path information about a bowl
   *     shape for connections.
   */
  protected makeBowl(): Shape {
    const maxW = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
    const maxH = maxW * 2;

    function makeRoundPath(
      blockHeight: number,
      up: boolean,
      right: boolean,
    ): string {
      const remainingHeight = blockHeight > maxH ? blockHeight - maxH : 0;
      const height = blockHeight > maxH ? maxH : blockHeight;
      const radius = height / 2;
      const sweep = right === up ? '0' : '1';
      return (
        svgPaths.arc(
          'a',
          '0 0,' + sweep,
          radius,
          svgPaths.point((right ? 1 : -1) * radius, (up ? -1 : 1) * radius),
        ) +
        svgPaths.lineOnAxis('v', (up ? -1 : 1) * remainingHeight) +
        svgPaths.arc(
          'a',
          '0 0,' + sweep,
          radius,
          svgPaths.point((right ? -1 : 1) * radius, (up ? -1 : 1) * radius),
        )
      );
    }

    function makeMainPath(
      blockHeight: number,
      up: boolean,
      right: boolean,
    ): string {
      const remainingHeight = blockHeight > maxH ? blockHeight - maxH : 0;
      const height = blockHeight > maxH ? maxH : blockHeight;
      const radius = height / 2;
      const dirR = right ? 1 : -1;
      const dirU = up ? -1 : 1;

      const totalHeight = height + remainingHeight;

      return (
        svgPaths.lineOnAxis('h', radius * dirR) +
        svgPaths.curve('q', [
          svgPaths.point((radius / 2) * -dirR, dirU * (totalHeight / 2)),
          svgPaths.point(0, totalHeight * dirU),
        ]) +
        svgPaths.lineOnAxis('h', radius * -dirR)
      );
    }

    return {
      type: this.SHAPES.BOWL,
      isDynamic: true,
      width(h) {
        const half = h / 2;
        return half > maxW ? maxW : half;
      },
      height(h) {
        return h;
      },
      connectionOffsetY(h) {
        return h / 2;
      },
      connectionOffsetX(w) {
        return -w;
      },
      pathDown(h) {
        return makeMainPath(h, false, false);
      },
      pathUp(h) {
        return makeMainPath(h, true, false);
      },
      pathRightDown(h) {
        return makeRoundPath(h, false, true);
      },
      pathRightUp(h) {
        return makeRoundPath(h, false, true);
      },
    };
  }

  /**
   * Create sizing and path information about a spikey shape.
   *
   * @returns An object containing sizing and path information about a spikey
   *     shape for connections.
   */
  protected makeSpikey(): Shape {
    const maxW = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
    const maxH = maxW * 2;

    function makeRoundedPath(
      blockHeight: number,
      up: boolean,
      right: boolean,
    ): string {
      const remainingHeight =
        blockHeight > maxH ? blockHeight - maxH : 0;
      const height = blockHeight > maxH ? maxH : blockHeight;
      const radius = height / 2;
      const sweep = right === up ? '0' : '1';
      return (
        svgPaths.arc(
          'a',
          '0 0,' + sweep,
          radius,
          svgPaths.point((right ? 1 : -1) * radius, (up ? -1 : 1) * radius),
        ) +
        svgPaths.lineOnAxis('v', (up ? -1 : 1) * remainingHeight) +
        svgPaths.arc(
          'a',
          '0 0,' + sweep,
          radius,
          svgPaths.point((right ? -1 : 1) * radius, (up ? -1 : 1) * radius),
        )
      );
    }

    function makeMainPath(
      blockHeight: number,
      up: boolean,
      right: boolean,
    ): string {
      const dirR = right ? 1 : -1;
      const dirU = up ? -1 : 1;

      const remainingHeight = blockHeight > maxH ? blockHeight - maxH : 0;
      const height = blockHeight > maxH ? maxH : blockHeight;
      const totalHeight = height + remainingHeight;
      const radius = (height / 4) * dirR;
      const radiusHeight = (totalHeight / 4) * dirU;

      return (
        svgPaths.lineOnAxis('h', radius * 2) +
        svgPaths.line([svgPaths.point(-radius, radiusHeight)]) +
        svgPaths.line([svgPaths.point(radius, radiusHeight)]) +
        svgPaths.line([svgPaths.point(-radius, radiusHeight)]) +
        svgPaths.line([svgPaths.point(radius, radiusHeight)]) +
        svgPaths.lineOnAxis('h', -radius * 2)
      );
    }

    return {
      type: this.SHAPES.SPIKEY,
      isDynamic: true,
      width(height: number): number {
        const halfHeight = height / 2;
        return halfHeight > maxW ? maxW : halfHeight;
      },
      height(height: number): number {
        return height;
      },
      connectionOffsetY(connectionHeight: number): number {
        return connectionHeight / 2;
      },
      connectionOffsetX(connectionWidth: number): number {
        return -connectionWidth;
      },
      pathDown(height: number): string {
        return makeMainPath(height, false, false);
      },
      pathUp(height: number): string {
        return makeMainPath(height, true, false);
      },
      pathRightDown(height: number): string {
        return makeRoundedPath(height, false, true);
      },
      pathRightUp(height: number): string {
        return makeRoundedPath(height, false, true);
      },
    };
  }

  override shapeFor(connection: RenderedConnection): Shape {
    let checks = connection.getCheck();
    if (!checks && connection.targetConnection) {
      checks = connection.targetConnection.getCheck();
    }
    let outputShape;
    switch (connection.type) {
      case ConnectionType.INPUT_VALUE:
      case ConnectionType.OUTPUT_VALUE:
        outputShape = connection.getSourceBlock().getOutputShape();
        // If the block has an output shape set, use that instead.
        if (outputShape !== null) {
          switch (outputShape) {
            case this.SHAPES.HEXAGONAL:
              return this.HEXAGONAL!;
            case this.SHAPES.ROUND:
              return this.ROUNDED!;
            case this.SHAPES.SQUARE:
              return this.SQUARED!;
            case this.SHAPES.PILLOW:
              return this.PILLOW!;
            case this.SHAPES.BOWL:
              return this.BOWL!;
            case this.SHAPES.SPIKEY:
              return this.SPIKEY!;
          }
        }
        // Includes doesn't work in IE.
        if (checks && checks.includes('Object')) {
          return this.PILLOW!;
        }
        if (checks && checks.includes('Array')) {
          return this.BOWL!;
        }
        if (checks && checks.includes('Set')) {
          return this.SPIKEY!;
        }
        if (checks && checks.includes('Boolean')) {
          return this.HEXAGONAL!;
        }
        if (checks && checks.includes('Number')) {
          return this.ROUNDED!;
        }
        if (checks && checks.includes('String')) {
          return this.ROUNDED!;
        }
        return this.ROUNDED!;
      case ConnectionType.PREVIOUS_STATEMENT:
      case ConnectionType.NEXT_STATEMENT:
        return this.NOTCH!;
      default:
        throw Error('Unknown type');
    }
  }

  override makeNotch() {
    const width = this.NOTCH_WIDTH;
    const height = this.NOTCH_HEIGHT;

    const innerWidth = width / 3;
    const curveWidth = innerWidth / 3;

    const halfHeight = height / 2;
    const quarterHeight = halfHeight / 2;

    /**
     * Make the main path for the notch.
     *
     * @param dir Direction multiplier to apply to horizontal offsets along the
     *     path. Either 1 or -1.
     * @returns A path fragment describing a notch.
     */
    function makeMainPath(dir: number): string {
      return (
        svgPaths.curve('c', [
          svgPaths.point((dir * curveWidth) / 2, 0),
          svgPaths.point((dir * curveWidth * 3) / 4, quarterHeight / 2),
          svgPaths.point(dir * curveWidth, quarterHeight),
        ]) +
        svgPaths.line([svgPaths.point(dir * curveWidth, halfHeight)]) +
        svgPaths.curve('c', [
          svgPaths.point((dir * curveWidth) / 4, quarterHeight / 2),
          svgPaths.point((dir * curveWidth) / 2, quarterHeight),
          svgPaths.point(dir * curveWidth, quarterHeight),
        ]) +
        svgPaths.lineOnAxis('h', dir * innerWidth) +
        svgPaths.curve('c', [
          svgPaths.point((dir * curveWidth) / 2, 0),
          svgPaths.point((dir * curveWidth * 3) / 4, -(quarterHeight / 2)),
          svgPaths.point(dir * curveWidth, -quarterHeight),
        ]) +
        svgPaths.line([svgPaths.point(dir * curveWidth, -halfHeight)]) +
        svgPaths.curve('c', [
          svgPaths.point((dir * curveWidth) / 4, -(quarterHeight / 2)),
          svgPaths.point((dir * curveWidth) / 2, -quarterHeight),
          svgPaths.point(dir * curveWidth, -quarterHeight),
        ])
      );
    }

    const pathLeft = makeMainPath(1);
    const pathRight = makeMainPath(-1);

    return {
      type: this.SHAPES.NOTCH,
      width,
      height,
      pathLeft,
      pathRight,
    };
  }

  override makeInsideCorners() {
    const radius = this.CORNER_RADIUS;

    const innerTopLeftCorner = svgPaths.arc(
      'a',
      '0 0,0',
      radius,
      svgPaths.point(-radius, radius),
    );

    const innerTopRightCorner = svgPaths.arc(
      'a',
      '0 0,1',
      radius,
      svgPaths.point(-radius, radius),
    );

    const innerBottomLeftCorner = svgPaths.arc(
      'a',
      '0 0,0',
      radius,
      svgPaths.point(radius, radius),
    );

    const innerBottomRightCorner = svgPaths.arc(
      'a',
      '0 0,1',
      radius,
      svgPaths.point(radius, radius),
    );

    return {
      width: radius,
      height: radius,
      pathTop: innerTopLeftCorner,
      pathBottom: innerBottomLeftCorner,
      rightWidth: radius,
      rightHeight: radius,
      pathTopRight: innerTopRightCorner,
      pathBottomRight: innerBottomRightCorner,
    };
  }

  override generateSecondaryColour_(colour: string) {
    return utilsColour.blend('#000', colour, 0.15) || colour;
  }

  override generateTertiaryColour_(colour: string) {
    return utilsColour.blend('#000', colour, 0.25) || colour;
  }

  override createDom(
    svg: SVGElement,
    tagName: string,
    selector: string,
    injectionDivIfIsParent?: HTMLElement,
  ) {
    super.createDom(svg, tagName, selector, injectionDivIfIsParent);
    /*
        <defs>
          ... filters go here ...
        </defs>
        */
    const defs = dom.createSvgElement(Svg.DEFS, {}, svg);
    // Using a dilate distorts the block shape.
    // Instead use a gaussian blur, and then set all alpha to 1 with a transfer.
    const selectedGlowFilter = dom.createSvgElement(
      Svg.FILTER,
      {
        'id': 'blocklySelectedGlowFilter' + this.randomIdentifier,
        'height': '160%',
        'width': '180%',
        'y': '-30%',
        'x': '-40%',
      },
      defs,
    );
    dom.createSvgElement(
      Svg.FEGAUSSIANBLUR,
      {'in': 'SourceGraphic', 'stdDeviation': this.SELECTED_GLOW_SIZE},
      selectedGlowFilter,
    );
    // Set all gaussian blur pixels to 1 opacity before applying flood
    const selectedComponentTransfer = dom.createSvgElement(
      Svg.FECOMPONENTTRANSFER,
      {'result': 'outBlur'},
      selectedGlowFilter,
    );
    dom.createSvgElement(
      Svg.FEFUNCA,
      {'type': 'table', 'tableValues': '0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1'},
      selectedComponentTransfer,
    );
    // Color the highlight
    dom.createSvgElement(
      Svg.FEFLOOD,
      {
        'flood-color': this.SELECTED_GLOW_COLOUR,
        'flood-opacity': 1,
        'result': 'outColor',
      },
      selectedGlowFilter,
    );
    dom.createSvgElement(
      Svg.FECOMPOSITE,
      {
        'in': 'outColor',
        'in2': 'outBlur',
        'operator': 'in',
        'result': 'outGlow',
      },
      selectedGlowFilter,
    );
    this.selectedGlowFilterId = selectedGlowFilter.id;
    this.selectedGlowFilter = selectedGlowFilter;

    // Using a dilate distorts the block shape.
    // Instead use a gaussian blur, and then set all alpha to 1 with a transfer.
    const replacementGlowFilter = dom.createSvgElement(
      Svg.FILTER,
      {
        'id': 'blocklyReplacementGlowFilter' + this.randomIdentifier,
        'height': '160%',
        'width': '180%',
        'y': '-30%',
        'x': '-40%',
      },
      defs,
    );
    dom.createSvgElement(
      Svg.FEGAUSSIANBLUR,
      {'in': 'SourceGraphic', 'stdDeviation': this.REPLACEMENT_GLOW_SIZE},
      replacementGlowFilter,
    );
    // Set all gaussian blur pixels to 1 opacity before applying flood
    const replacementComponentTransfer = dom.createSvgElement(
      Svg.FECOMPONENTTRANSFER,
      {'result': 'outBlur'},
      replacementGlowFilter,
    );
    dom.createSvgElement(
      Svg.FEFUNCA,
      {'type': 'table', 'tableValues': '0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1'},
      replacementComponentTransfer,
    );
    // Color the highlight
    dom.createSvgElement(
      Svg.FEFLOOD,
      {
        'flood-color': this.REPLACEMENT_GLOW_COLOUR,
        'flood-opacity': 1,
        'result': 'outColor',
      },
      replacementGlowFilter,
    );
    dom.createSvgElement(
      Svg.FECOMPOSITE,
      {
        'in': 'outColor',
        'in2': 'outBlur',
        'operator': 'in',
        'result': 'outGlow',
      },
      replacementGlowFilter,
    );
    dom.createSvgElement(
      Svg.FECOMPOSITE,
      {
        'in': 'SourceGraphic',
        'in2': 'outGlow',
        'operator': 'over',
      },
      replacementGlowFilter,
    );
    this.replacementGlowFilterId = replacementGlowFilter.id;
    this.replacementGlowFilter = replacementGlowFilter;

    if (injectionDivIfIsParent) {
      // If this renderer is for the parent workspace, add CSS variables scoped
      // to the injection div referencing the created patterns so that CSS can
      // apply the patterns to any element in the injection div.
      injectionDivIfIsParent.style.setProperty(
        '--blocklySelectedGlowFilter',
        `url(#${this.selectedGlowFilterId})`,
      );
      injectionDivIfIsParent.style.setProperty(
        '--blocklyReplacementGlowFilter',
        `url(#${this.replacementGlowFilterId})`,
      );
    }
  }

  override getCSS_(selector: string) {
    return [
      // Text.
      `${selector} .blocklyText,`,
      `${selector} .blocklyFlyoutLabelText {`,
      `font: ${this.FIELD_TEXT_FONTWEIGHT} ${this.FIELD_TEXT_FONTSIZE}` +
        `pt ${this.FIELD_TEXT_FONTFAMILY};`,
      `}`,

      `${selector} .blocklyTextInputBubble textarea {`,
      `font-weight: normal;`,
      `}`,

      // Fields.
      `${selector} .blocklyText {`,
      `fill: #fff;`,
      `}`,
      `${selector} .blocklyNonEditableField>rect:not(.blocklyDropdownRect),`,
      `${selector} .blocklyEditableField>rect:not(.blocklyDropdownRect) {`,
      `fill: ${this.FIELD_BORDER_RECT_COLOUR};`,
      `}`,
      `${selector} .blocklyNonEditableField>text,`,
      `${selector} .blocklyEditableField>text,`,
      `${selector} .blocklyNonEditableField>g>text,`,
      `${selector} .blocklyEditableField>g>text {`,
      `fill: #575E75;`,
      `}`,

      // Flyout labels.
      `${selector} .blocklyFlyoutLabelText {`,
      `fill: #575E75;`,
      `}`,

      // Bubbles.
      `${selector} .blocklyText.blocklyBubbleText {`,
      `fill: #575E75;`,
      `}`,

      // Editable field hover.
      `${selector} .blocklyDraggable:not(.blocklyDisabled)`,
      ` .blocklyEditableField:not(.blocklyEditing):hover>rect,`,
      `${selector} .blocklyDraggable:not(.blocklyDisabled)`,
      ` .blocklyEditableField:not(.blocklyEditing):hover>.blocklyPath {`,
      `stroke: #fff;`,
      `stroke-width: 2;`,
      `}`,

      // Text field input.
      `${selector} .blocklyHtmlInput {`,
      `font-family: ${this.FIELD_TEXT_FONTFAMILY};`,
      `font-weight: ${this.FIELD_TEXT_FONTWEIGHT};`,
      `color: #575E75;`,
      `}`,

      // Dropdown field.
      `${selector} .blocklyDropdownText {`,
      `fill: #fff !important;`,
      `}`,

      // Widget and Dropdown Div
      `${selector}.blocklyWidgetDiv .blocklyMenuItem,`,
      `${selector}.blocklyDropDownDiv .blocklyMenuItem {`,
      `font-family: ${this.FIELD_TEXT_FONTFAMILY};`,
      `}`,
      `${selector}.blocklyDropDownDiv .blocklyMenuItemContent {`,
      `color: #fff;`,
      `}`,

      // Connection highlight.
      `${selector} .blocklyHighlightedConnectionPath {`,
      `stroke: ${this.SELECTED_GLOW_COLOUR};`,
      `}`,

      // Disabled outline paths.
      `${selector} .blocklyDisabledPattern > .blocklyOutlinePath {`,
      `fill: var(--blocklyDisabledPattern)`,
      `}`,

      // Insertion marker.
      `${selector} .blocklyInsertionMarker>.blocklyPath {`,
      `fill-opacity: ${this.INSERTION_MARKER_OPACITY};`,
      `stroke: none;`,
      `}`,

      `${selector} .blocklySelected>.blocklyPath.blocklyPathSelected {`,
      `fill: none;`,
      `filter: var(--blocklySelectedGlowFilter);`,
      `}`,

      `${selector} .blocklyReplaceable>.blocklyPath {`,
      `filter: var(--blocklyReplacementGlowFilter);`,
      `}`,
    ];
  }
}
