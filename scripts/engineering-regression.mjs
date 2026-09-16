import assert from 'node:assert/strict';
import fs from 'node:fs';

const login = fs.readFileSync('app/api/auth/login/route.ts', 'utf8');
const students = fs.readFileSync('app/api/admin/students/route.ts', 'utf8');
const staff = fs.readFileSync('app/api/admin/staff/route.ts', 'utf8');

assert.match(login, /staff_profiles/);
assert.match(login, /sp\.staff_id/);
assert.match(students, /INSERT INTO users/);
assert.match(students, /WITH target AS/);
assert.match(students, /FOR UPDATE/);
assert.match(staff, /WITH new_user AS/);
assert.match(staff, /FOR UPDATE/);

console.log('engineering regression checks passed');
