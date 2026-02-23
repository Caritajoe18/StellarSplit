//! # Events Module for Achievement Badges Contract
//!
//! This module defines events emitted by the badge contract.

use soroban_sdk::{Address, Env, String};
use crate::types::*;

/// Emit initialization event
pub fn emit_initialized(env: &Env, admin: &Address) {
    env.events().publish(("init", "admin"), admin);
}

/// Emit badge minted event
pub fn emit_badge_minted(env: &Env, user: &Address, badge_type: &BadgeType, token_id: &String) {
    env.events().publish(("badge_minted", "user", "badge_type", "token_id"), (user, badge_type, token_id));
}