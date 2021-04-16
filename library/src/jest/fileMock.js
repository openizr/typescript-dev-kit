/**
 * Copyright (c) Matthieu Jabbour. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// This mock is used to provide webpack support with Jest.
// Each time a non-Javascript file is `import`ed, its content is replaced by `file`.
module.exports = 'file';
